Write-Host "Starting System Backup..."

# 1. Commit Changes
git add .
git commit -m "final: system audit complete, ssl fixed, stable build [archiving to D:]"

# 2. Prepare Archive Name
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$zipName = "WorldEngine_Verified_Stable_$timestamp.zip"
$tempZip = ".\$zipName"

# 3. Create Source Archive (Excluding node_modules and .git folder directly to avoid permission locks)
Write-Host "Archiving source code..."
$items = Get-ChildItem -Path . -Exclude "node_modules", ".git", "*.zip", "*.bundle"
Compress-Archive -Path $items.FullName -DestinationPath $tempZip -Force

# 4. Backup Git History safely using Git Bundle
Write-Host "Bundling Git history..."
git bundle create repo_history.bundle --all
if (Test-Path repo_history.bundle) {
    Compress-Archive -Path repo_history.bundle -Update -DestinationPath $tempZip
    Remove-Item repo_history.bundle
} else {
    Write-Warning "Git bundle failed. History might be incomplete."
}

# 5. Transfer to USB (D:)
if (Test-Path D:) {
    Write-Host "USB Drive (D:) Detected. Transferring..."
    Copy-Item -Path $tempZip -Destination "D:\$zipName" -Force
    if (Test-Path "D:\$zipName") {
        Write-Host "✅ SUCCESS: Backup Verified on D:\$zipName"
        # Optional: Remove local copy if successful
        # Remove-Item $tempZip
    } else {
        Write-Error "❌ Copy Failed."
    }
} else {
    Write-Warning "⚠️ D: Drive NOT FOUND. Backup saved locally at $tempZip"
    
    # Create a batch script for the user to run later
    $batContent = "copy `"$zipName`" D:\"
    Set-Content -Path "transfer_to_usb.bat" -Value $batContent
    Write-Host "Created 'transfer_to_usb.bat' for manual transfer."
}

Write-Host "Backup Process Complete."
