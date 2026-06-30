' AutoEdit - hidden server launcher (no console window).
' Bundled into the installer; the panel and the Startup shortcut both call this.
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

strPath = fso.GetParentFolderName(WScript.ScriptFullName)
strExe = strPath & "\server\AutoEdit-Server.exe"

If Not fso.FileExists(strExe) Then
    MsgBox "AutoEdit server not found:" & vbCrLf & vbCrLf & strExe & vbCrLf & vbCrLf & _
           "The installation looks incomplete. Please reinstall AutoEdit.", _
           vbCritical + vbOKOnly, "AutoEdit"
    WScript.Quit 1
End If

' Put bundled ffmpeg on PATH if present
Dim objEnv
Set objEnv = WshShell.Environment("Process")
If fso.FolderExists(strPath & "\ffmpeg") Then
    objEnv("PATH") = strPath & "\ffmpeg;" & objEnv("PATH")
End If

' 0 = hidden window, False = don't wait
WshShell.Run """" & strExe & """", 0, False
