# BizyAir APK Build Script (arm64-v8a only)
# Usage: .\build-android.ps1 [-Clean]

param([switch]$Clean)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " BizyAir APK Build (arm64-v8a only)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Verify architecture config
Write-Host "`n[1/7] Verifying architecture config..." -ForegroundColor Yellow

$appJsonRaw = Get-Content app.json -Raw
if ($appJsonRaw -match '"reactNativeArchitectures"\s*:\s*\[\s*"arm64-v8a"\s*\]') {
    Write-Host "  app.json: reactNativeArchitectures = arm64-v8a OK" -ForegroundColor Green
} else {
    Write-Host "  app.json architecture config error" -ForegroundColor Red
    exit 1
}

# 2. Auto-increment version
Write-Host "`n[2/7] Auto-incrementing version..." -ForegroundColor Yellow
$appJsonPath = Join-Path $PSScriptRoot "app.json"
$appJsonContent = Get-Content $appJsonPath -Raw
$appJson = $appJsonContent | ConvertFrom-Json
$oldVersion = $appJson.expo.version
$versionParts = $oldVersion -split '\.'
$versionParts[2] = [int]$versionParts[2] + 1
$newVersion = $versionParts -join '.'
$appJson.expo.version = $newVersion
$appJson | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath -NoNewline
Write-Host "  Version: $oldVersion -> $newVersion" -ForegroundColor Green

git add app.json 2>&1 | Out-Null
git commit -m "chore: bump version to $newVersion" --no-verify 2>&1 | Out-Null
Write-Host "  Committed version change" -ForegroundColor Green

# 3. Clean (optional)
if ($Clean) {
    Write-Host "`n[3/7] Cleaning old build artifacts..." -ForegroundColor Yellow
    if (Test-Path android) { Remove-Item -Recurse -Force android }
    Write-Host "  Cleaned" -ForegroundColor Green
} else {
    Write-Host "`n[3/7] Skip clean (use -Clean to clean)" -ForegroundColor Gray
}

# 4. Prebuild
Write-Host "`n[4/7] Running expo prebuild..." -ForegroundColor Yellow
npx expo prebuild --platform android --clean 2>&1 | Write-Host
if ($LASTEXITCODE -ne 0) { Write-Host "  prebuild FAILED!" -ForegroundColor Red; exit 1 }
Write-Host "  prebuild done" -ForegroundColor Green

# 5. Configure gradle.properties
Write-Host "`n[5/7] Configuring gradle.properties..." -ForegroundColor Yellow
$gradlePropsPath = Join-Path $PSScriptRoot "android\gradle.properties"
if (Test-Path $gradlePropsPath) {
    $content = Get-Content $gradlePropsPath -Raw
    $content = $content -replace "react\.nativeArchitectures=.*`r?`n?", ""
    $content = $content -replace "reactNativeArchitectures=.*`r?`n?", ""
    Set-Content $gradlePropsPath $content -NoNewline
    Write-Host "  Cleaned legacy architecture properties" -ForegroundColor Green
} else {
    Write-Host "  gradle.properties not found, prebuild may have failed" -ForegroundColor Red
    exit 1
}

# 6. Apply post-prebuild patches + versionCode sync
Write-Host "`n[6/7] Applying post-prebuild patches..." -ForegroundColor Yellow
& "$PSScriptRoot\scripts\patch-android-build.ps1" -ProjectRoot $PSScriptRoot
if ($LASTEXITCODE -ne 0) { Write-Host "  Patching FAILED!" -ForegroundColor Red; exit 1 }
Write-Host "  Patches applied" -ForegroundColor Green

# Sync versionCode from new version
$propsContent = Get-Content $gradlePropsPath -Raw
$newVersionCode = $versionParts[2]
if ($propsContent -match 'android\.versionCode=(\d+)') {
    $oldCode = $Matches[1]
    $propsContent = $propsContent -replace "android\.versionCode=\d+", "android.versionCode=$newVersionCode"
    Set-Content $gradlePropsPath $propsContent -NoNewline
    Write-Host "  versionCode: $oldCode -> $newVersionCode" -ForegroundColor Green
} else {
    Add-Content $gradlePropsPath "`nandroid.versionCode=$newVersionCode"
    Write-Host "  versionCode: $newVersionCode" -ForegroundColor Green
}

# 7. Build Release APK
Write-Host "`n[7/7] Building Release APK..." -ForegroundColor Yellow
$androidDir = Join-Path $PSScriptRoot "android"
Push-Location $androidDir
try {
    .\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a 2>&1 | Write-Host
    if ($LASTEXITCODE -ne 0) { Write-Host "  Build FAILED!" -ForegroundColor Red; exit 1 }
} finally {
    Pop-Location
}

# Verify output
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Build Result Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$apkDir = Join-Path $PSScriptRoot "android\app\build\outputs\apk\release"
$apks = Get-ChildItem -Path $apkDir -Filter "*.apk" -ErrorAction SilentlyContinue

if ($apks.Count -eq 0) {
    Write-Host "  No APK found!" -ForegroundColor Red
    exit 1
}

foreach ($apk in $apks) {
    $sizeMB = [math]::Round($apk.Length / 1MB, 2)
    $sizeStr = "$sizeMB MB"
    Write-Host "  APK: $($apk.Name) $sizeStr" -ForegroundColor White

    Write-Host "  Verifying native lib architectures..." -ForegroundColor Yellow
    Add-Type -Assembly System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($apk.FullName)
    $libDirs = @()
    foreach ($entry in $zip.Entries) {
        if ($entry.FullName -match "^lib/([^/]+)/") {
            $arch = $Matches[1]
            if ($libDirs -notcontains $arch) { $libDirs += $arch }
        }
    }
    $zip.Dispose()

    if ($libDirs.Count -eq 1 -and $libDirs[0] -eq "arm64-v8a") {
        Write-Host "  Architecture OK: arm64-v8a only" -ForegroundColor Green
    } else {
        Write-Host "  Architecture FAIL: found $libDirs" -ForegroundColor Red
    }
}

Write-Host "`nBuild complete!" -ForegroundColor Green
