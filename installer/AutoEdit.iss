; AutoEdit Installer Script for Inno Setup 6
; Self-contained: bundles the AutoEdit server exe, FFmpeg, and the CEP extension.
; Built automatically by .github/workflows/build-installer.yml on a Windows runner.

#define MyAppName "AutoEdit"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Rahul Gautam"
#define MyAppURL "https://github.com/REPLACE_ME/AutoEdit"

[Setup]
; IMPORTANT: generate a fresh GUID in Inno Setup (Tools > Generate GUID) and paste below.
AppId={{E1F2A3B4-C5D6-47E8-9A0B-1C2D3E4F5A6B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} v{#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}/issues
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=LICENSE
OutputDir=installer\dist
OutputBaseFilename=AutoEdit-Setup-{#MyAppVersion}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64compatible
ChangesEnvironment=yes
; SetupIconFile=img\autoedit.ico        ; add your own icon and uncomment

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"
Name: "autostart"; Description: "Start AutoEdit automatically when Windows starts (recommended)"; GroupDescription: "Startup:"
Name: "installextension"; Description: "Install the AutoEdit extension for Adobe Premiere Pro"; GroupDescription: "Adobe Integration:"

[Files]
; Bundled server (PyInstaller output: includes Python runtime + all deps)
Source: "dist\AutoEdit-Server\*"; DestDir: "{app}\server"; Flags: ignoreversion recursesubdirs createallsubdirs
; Bundled FFmpeg
Source: "ffmpeg\ffmpeg.exe";  DestDir: "{app}\ffmpeg"; Flags: ignoreversion
Source: "ffmpeg\ffprobe.exe"; DestDir: "{app}\ffmpeg"; Flags: ignoreversion
; Hidden launcher
Source: "installer\AutoEdit-Launcher.vbs"; DestDir: "{app}"; Flags: ignoreversion
; CEP extension -> goes into the per-user CEP extensions folder
Source: "extension\com.autoedit.panel\*"; DestDir: "{userappdata}\Adobe\CEP\extensions\com.autoedit.panel"; Flags: ignoreversion recursesubdirs createallsubdirs; Tasks: installextension

[Icons]
Name: "{group}\AutoEdit Server";           Filename: "wscript.exe"; Parameters: """{app}\AutoEdit-Launcher.vbs"""; WorkingDir: "{app}"
Name: "{group}\AutoEdit Server (Console)"; Filename: "{app}\server\AutoEdit-Server.exe"; WorkingDir: "{app}\server"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\AutoEdit"; Filename: "wscript.exe"; Parameters: """{app}\AutoEdit-Launcher.vbs"""; WorkingDir: "{app}"; Tasks: desktopicon
; Hidden auto-start at login
Name: "{userstartup}\AutoEdit"; Filename: "wscript.exe"; Parameters: """{app}\AutoEdit-Launcher.vbs"""; WorkingDir: "{app}"; Tasks: autostart

[Registry]
Root: HKCU; Subkey: "Software\{#MyAppName}"; ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"; Flags: uninsdeletekey
; Enable unsigned CEP extensions (PlayerDebugMode) across Premiere CC versions (CSXS 9-18)
Root: HKCU; Subkey: "Software\Adobe\CSXS.9";  ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.10"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.11"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.12"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.13"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.14"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.15"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.16"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.17"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension
Root: HKCU; Subkey: "Software\Adobe\CSXS.18"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: createvalueifdoesntexist; Tasks: installextension

[Run]
; Start AutoEdit (hidden) right after install
Filename: "wscript.exe"; Parameters: """{app}\AutoEdit-Launcher.vbs"""; Description: "Start AutoEdit Server"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{userappdata}\Adobe\CEP\extensions\com.autoedit.panel"
