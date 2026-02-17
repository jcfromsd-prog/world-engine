$timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$backupDir = "D:\Backup_WorldEngine_$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
$source = "D:\MyBestPurpose_SecureBackup\*.zip"
if (Test-Path $source) {
    Move-Item -Path $source -Destination $backupDir -Force
    Write-Host "Backup moved to $backupDir"
    Invoke-Item $backupDir
}
else {
    Write-Error "No backup files found in source location: D:\MyBestPurpose_SecureBackup"
}
