$WshShell = New-Object -ComObject WScript.Shell

# 1. Shortcut to 1-Click Game Launcher
$ShortcutPlay = $WshShell.CreateShortcut("C:\Users\lenovo\Desktop\Play Shadow Ledger.lnk")
$ShortcutPlay.TargetPath = "C:\Users\lenovo\.gemini\antigravity-ide\scratch\shadow-ledger\play_shadow_ledger.bat"
$ShortcutPlay.WorkingDirectory = "C:\Users\lenovo\.gemini\antigravity-ide\scratch\shadow-ledger"
$ShortcutPlay.Description = "Launch Shadow Ledger Game Server"
$ShortcutPlay.Save()

# 2. Shortcut to Project Folder
$ShortcutFolder = $WshShell.CreateShortcut("C:\Users\lenovo\Desktop\Shadow Ledger - Project Folder.lnk")
$ShortcutFolder.TargetPath = "C:\Users\lenovo\.gemini\antigravity-ide\scratch\shadow-ledger"
$ShortcutFolder.Description = "Shadow Ledger Project Directory"
$ShortcutFolder.Save()

# 3. Shortcut to Android APK
$ShortcutApk = $WshShell.CreateShortcut("C:\Users\lenovo\Desktop\Shadow Ledger - Android APK.lnk")
$ShortcutApk.TargetPath = "C:\Users\lenovo\.gemini\antigravity-ide\scratch\shadow-ledger\android\app\build\outputs\apk\debug\app-debug.apk"
$ShortcutApk.Description = "Shadow Ledger Android APK file"
$ShortcutApk.Save()

Write-Output "All 3 Shortcuts created successfully on Desktop!"
