# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for AutoEdit Server
# Adapted from OpenCut's spec. Produces a self-contained AutoEdit-Server.exe
# that bundles its OWN Python runtime + all AI deps (no system Python -> no DLL crash).
# This spec is copied into the OpenCut source tree by the CI workflow, then built there.

import os
from PyInstaller.utils.hooks import collect_data_files, collect_submodules, collect_dynamic_libs

block_cipher = None

# --- AutoEdit fix #2: force-include native DLLs (ctranslate2/cv2/etc.) ----------
# PyInstaller often misses these .dll/.pyd files, which makes the server crash at
# the C level on the first request (no Python traceback). Collect them explicitly.
native_binaries = []
for _pkg in ['ctranslate2', 'faster_whisper', 'cv2', 'av', 'soundfile',
             'numpy', 'tokenizers', 'sentencepiece', 'onnxruntime', 'scipy']:
    try:
        native_binaries += collect_dynamic_libs(_pkg)
    except Exception:
        pass
# -------------------------------------------------------------------------------

# --- AutoEdit fix: disable system-site-packages injection ----------------------
# The bundled server otherwise reaches into the user's system Python and loads
# mismatched native libraries, which hard-crashes the process on the first
# request. Neutralise the call so the bundle uses ONLY its own packages.
import os as _os
_sp = _os.path.join('opencut', 'server.py')
try:
    _src = open(_sp, encoding='utf-8').read()
    if '\n_setup_system_site_packages()\n' in _src:
        _src = _src.replace('\n_setup_system_site_packages()\n',
                            '\n# _setup_system_site_packages()  # AutoEdit: disabled (bundled deps only)\n')
        open(_sp, 'w', encoding='utf-8').write(_src)
        print('AutoEdit: disabled system-site-packages injection in opencut/server.py')
    # enable faulthandler so any native crash writes a C stack we can read
    _fh = ('import faulthandler as _fh, os as _o\n'
           'try:\n'
           '    _o.makedirs(_o.path.join(_o.path.expanduser("~"), ".opencut"), exist_ok=True)\n'
           '    _fh.enable(open(_o.path.join(_o.path.expanduser("~"), ".opencut", "native_crash.log"), "w"))\n'
           'except Exception:\n'
           '    pass\n')
    _src2 = open(_sp, encoding='utf-8').read()
    if 'faulthandler' not in _src2:
        _src2 = _src2.replace('import traceback\n', 'import traceback\n' + _fh, 1)
        open(_sp, 'w', encoding='utf-8').write(_src2)
        print('AutoEdit: enabled native crash logging')
    else:
        print('AutoEdit WARNING: call site not found (server.py changed?)')
except FileNotFoundError:
    print('AutoEdit WARNING: opencut/server.py not found at build time')
# -------------------------------------------------------------------------------

# Collect all opencut submodules (lazy imports in route handlers)
opencut_hiddenimports = collect_submodules('opencut')

# External deps that are lazily imported inside route handlers
external_hiddenimports = [
    'faster_whisper', 'ctranslate2', 'huggingface_hub',
    'cv2', 'PIL', 'PIL.Image', 'PIL.ImageDraw', 'PIL.ImageFont',
    'numpy', 'librosa', 'pydub', 'noisereduce', 'deep_translator',
    'scenedetect', 'flask', 'flask_cors', 'click', 'rich',
    'soundfile', 'tokenizers', 'sentencepiece',
    'mediapipe', 'auto_editor', 'transnetv2', 'resemble_enhance',
]

# Filter to only actually installed packages
valid_imports = []
for mod in external_hiddenimports:
    try:
        __import__(mod)
        valid_imports.append(mod)
    except ImportError:
        pass

all_hiddenimports = opencut_hiddenimports + valid_imports

extra_datas = collect_data_files('opencut.data')
for pkg in ['ctranslate2', 'faster_whisper']:
    try:
        extra_datas += collect_data_files(pkg)
    except Exception:
        pass

a = Analysis(
    [os.path.join('opencut', 'server.py')],
    pathex=['.'],
    binaries=native_binaries,
    datas=extra_datas,
    hiddenimports=all_hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'torch', 'torchaudio', 'torchvision',
        'demucs', 'audiocraft',
        'realesrgan', 'gfpgan', 'insightface', 'rembg',
        'onnxruntime', 'onnxruntime_gpu',
        'pyannote', 'whisperx',
        'pedalboard', 'edge_tts', 'kokoro',
        'pytest', 'ruff', 'black', 'mypy',
        'tkinter', '_tkinter', 'matplotlib',
    ],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='AutoEdit-Server',          # <-- rebranded
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    icon=os.path.join('img', 'logo.ico'),   # swap for your own AutoEdit icon if desired
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='AutoEdit-Server',          # <-- output folder: dist/AutoEdit-Server/
)
