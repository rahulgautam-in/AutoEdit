# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for AutoEdit Server
# Adapted from OpenCut's spec. Produces a self-contained AutoEdit-Server.exe
# that bundles its OWN Python runtime + all AI deps (no system Python -> no DLL crash).
# This spec is copied into the OpenCut source tree by the CI workflow, then built there.

import os
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

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
    binaries=[],
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
