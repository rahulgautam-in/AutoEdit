# AutoEdit

A free, open-source **AI editing extension for Adobe Premiere Pro** — remove silences, cut bad/repeated takes, auto-zoom, and generate + translate captions (incl. Hindi → English). Everything runs locally on your machine. No subscription, no API key for core features.

Built on the MIT-licensed [OpenCut](https://github.com/SysAdminDoc/OpenCut), rebranded and packaged as a single installer.

---

## For users

1. Download **`AutoEdit-Setup.exe`** from the [Releases](#) page.
2. Run it. It installs everything — the AI backend (with its own bundled Python), FFmpeg, and the Premiere extension — and can start automatically with Windows.
3. Open Premiere Pro → **Window → Extensions → AutoEdit**.
4. First run walks you through picking the best speech model for your PC. Then just edit.

> The backend runs invisibly in the background. There is no server window to manage.
> Unsigned build: Windows may show "unknown publisher" — click **More info → Run anyway**.

### Features
- **Cut** — remove silences, cut filler words ("um/uh")
- **Captions** — transcribe (incl. Hindi + 10 Indian languages), detect repeated/bad takes, translate to English, import SRT as native captions
- **Video** — auto zoom in/out
- 100% local · free · open source

---

## For developers / building it yourself

This repo is a **branding + build overlay** on top of OpenCut. The installer is built automatically by GitHub Actions — you don't need a Windows machine.

### How the build works
1. `.github/workflows/build-installer.yml` runs on a Windows cloud runner.
2. It clones OpenCut at the pinned ref (`PINNED_COMMIT.txt` → `v1.25.1`).
3. Overlays this repo's `extension/com.autoedit.panel/`, `build/autoedit_server.spec`, and `installer/`.
4. Bundles the server with PyInstaller (own Python runtime), fetches FFmpeg, compiles `installer/AutoEdit.iss` with Inno Setup.
5. Produces `AutoEdit-Setup-<version>.exe` and attaches it to the GitHub Release.

### To release
- Push a tag: `git tag v1.0.0 && git push --tags` → the installer builds and attaches itself to the release.
- Or run the workflow manually from the Actions tab.

### Repo layout
```
extension/com.autoedit.panel/   AutoEdit CEP extension (rebranded UI: Cut/Captions/Video/Settings)
build/autoedit_server.spec      PyInstaller spec -> AutoEdit-Server.exe (bundled Python)
installer/AutoEdit.iss          Inno Setup script -> AutoEdit-Setup.exe
installer/AutoEdit-Launcher.vbs Hidden server launcher (no console)
.github/workflows/              CI that builds the installer
PINNED_COMMIT.txt               OpenCut source version (server + UI base)
LICENSE                         MIT (with OpenCut attribution)
```

### Before first release — TODO
- [ ] Set your repo URL in `installer/AutoEdit.iss` (`MyAppURL`) and this README.
- [ ] Generate a fresh GUID for `AppId` in `AutoEdit.iss` (Inno Setup → Tools → Generate GUID).
- [ ] (Optional) Add your own `img/autoedit.ico` and reference it in the spec + iss.
- [ ] (Optional, later) Add code signing to remove the "unknown publisher" warning.

---

## Credits
AutoEdit stands on [OpenCut](https://github.com/SysAdminDoc/OpenCut) by SysAdminDoc (MIT). Huge thanks to that project.
