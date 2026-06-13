# BizyAir APK Build Script (arm64-v8a only)
# Usage:
#   .\build-android.ps1              Incremental build, auto-increment version
#   .\build-android.ps1 -Clean       Full clean build (stop daemon, delete android/, rebuild from scratch)

param([switch]$Clean)

$ErrorActionPreference = "Stop"
$ScriptDir = $PSScriptRoot

# 要求 PowerShell 7+（Core），Windows PowerShell 5.1 会解析报错
if ($PSVersionTable.PSVersion.Major -lt 7) {
    Write-Host "ERROR: This script requires PowerShell 7+ (pwsh). Current: $($PSVersionTable.PSVersion)" -ForegroundColor Red
    Write-Host "Please run with: pwsh -File $PSCommandPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " BizyAir APK Build (arm64-v8a only)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [1/8] 验证架构配置
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[1/8] Verifying architecture config..." -ForegroundColor Yellow

$appJsonPath = Join-Path $ScriptDir "app.json"
$appJsonRaw = Get-Content $appJsonPath -Raw
$archMatch = $appJsonRaw -match '"reactNativeArchitectures"\s*:\s*\[([^\]]+)\]'
if ($archMatch) {
    Write-Host "  app.json: reactNativeArchitectures = $($matches[1].Trim()) OK" -ForegroundColor Green
} else {
    Write-Host "  app.json architecture config error" -ForegroundColor Red
    exit 1
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [2/8] 自动递增版本号
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[2/8] Auto-incrementing version..." -ForegroundColor Yellow

$appJsonContent = [System.IO.File]::ReadAllText($appJsonPath).TrimStart([char]0xFEFF)
$appJson = $appJsonContent | ConvertFrom-Json
$oldVersion = $appJson.expo.version
$versionParts = $oldVersion -split '\.'
$versionParts[2] = [int]$versionParts[2] + 1
$newVersion = $versionParts -join '.'
$appJson.expo.version = $newVersion
[System.IO.File]::WriteAllText($appJsonPath, ($appJson | ConvertTo-Json -Depth 10))
Write-Host "  Version: $oldVersion -> $newVersion" -ForegroundColor Green

$architectures = $appJson.expo.plugins | ForEach-Object {
    if ($_ -is [Array] -and $_[0] -eq "expo-build-properties") {
        $prop = $_[1]
        if ($prop.android.reactNativeArchitectures) {
            return $prop.android.reactNativeArchitectures
        }
    }
}
if (-not $architectures) { $architectures = @("arm64-v8a") }
Write-Host "  Architectures: $($architectures -join ', ')" -ForegroundColor Green

git add app.json 2>&1 | Out-Null
git commit -m "chore: bump version to $newVersion" --no-verify 2>&1 | Out-Null
Write-Host "  Committed version change" -ForegroundColor Green

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [3/8] 备份签名密钥（必须在 Clean/prebuild 之前）
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[3/8] Backing up signing key..." -ForegroundColor Yellow

$backupDir = Join-Path $ScriptDir "keystore-backup"
$keystoreSrc = Join-Path $ScriptDir "android\app\bizyair-release.keystore"
$keystorePropsSrc = Join-Path $ScriptDir "android\keystore.properties"
$keystoreDst = Join-Path $backupDir "bizyair-release.keystore"
$keystorePropsDst = Join-Path $backupDir "keystore.properties"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "  Created keystore-backup/ directory" -ForegroundColor Green
}

if (Test-Path $keystoreSrc) {
    Copy-Item $keystoreSrc $keystoreDst -Force
    Write-Host "  Keystore backed up" -ForegroundColor Green
} else {
    if ($Clean) {
        Write-Host "  No existing keystore, but backup exists — will restore after prebuild" -ForegroundColor Gray
    } else {
        Write-Host "  No existing keystore found in android dir" -ForegroundColor Gray
    }
}

if (Test-Path $keystorePropsSrc) {
    Copy-Item $keystorePropsSrc $keystorePropsDst -Force
    Write-Host "  keystore.properties backed up" -ForegroundColor Green
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [4/8] Clean 模式（可选）
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if ($Clean) {
    Write-Host "`n[4/8] Full clean build..." -ForegroundColor Yellow

    # 先停止 Gradle daemon，避免文件锁冲突
    $gradlewBat = Join-Path $ScriptDir "android\gradlew.bat"
    if (Test-Path $gradlewBat) {
        Push-Location (Join-Path $ScriptDir "android")
        try { .\gradlew.bat --stop 2>&1 | Out-Null } catch {}
        Pop-Location
    }

    Write-Host "  Deleting android/ directory..." -ForegroundColor Gray
    if (Test-Path (Join-Path $ScriptDir "android")) {
        [System.IO.Directory]::Delete((Join-Path $ScriptDir "android"), $true)
    }
    Write-Host "  Cleaned" -ForegroundColor Green
} else {
    Write-Host "`n[4/8] Skip clean (use -Clean for full rebuild)" -ForegroundColor Gray
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [5/8] expo prebuild
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[5/8] Running expo prebuild..." -ForegroundColor Yellow
$env:CI = "1"
npx expo prebuild --platform android --clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "  prebuild FAILED!" -ForegroundColor Red
    exit 1
}
Write-Host "  prebuild done" -ForegroundColor Green

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [5.5/8] 恢复签名密钥
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[5.5/8] Restoring signing key..." -ForegroundColor Yellow

$keystoreRestored = $false
if (Test-Path $keystoreDst) {
    Copy-Item $keystoreDst (Join-Path $ScriptDir "android\app\") -Force
    Write-Host "  Keystore restored from backup" -ForegroundColor Green
    $keystoreRestored = $true
} else {
    Write-Host "  WARNING: No keystore backup in keystore-backup/" -ForegroundColor Red
    Write-Host "  APK will be signed with debug key — cannot overwrite previous installs" -ForegroundColor Red
}

if (Test-Path $keystorePropsDst) {
    Copy-Item $keystorePropsDst (Join-Path $ScriptDir "android") -Force
    Write-Host "  keystore.properties restored" -ForegroundColor Green
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [6/8] 应用 post-prebuild 补丁
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[6/8] Applying post-prebuild patches..." -ForegroundColor Yellow

$patchScript = Join-Path $ScriptDir "scripts\patch-android-build.ps1"
& $patchScript -ProjectRoot $ScriptDir
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Patching FAILED!" -ForegroundColor Red
    exit 1
}
Write-Host "  Patches applied" -ForegroundColor Green

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [7/8] 同步 versionCode
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[7/8] Syncing versionCode..." -ForegroundColor Yellow

$gradlePropsPath = Join-Path $ScriptDir "android\gradle.properties"
$propsContent = Get-Content $gradlePropsPath -Raw

if ($propsContent -match 'android\.versionCode=(\d+)') {
    $oldCode = [int]$Matches[1]
    $newVersionCode = $oldCode + 1
    $propsContent = $propsContent -replace "android\.versionCode=\d+", "android.versionCode=$newVersionCode"
    [System.IO.File]::WriteAllText($gradlePropsPath, $propsContent)
    Write-Host "  versionCode: $oldCode -> $newVersionCode" -ForegroundColor Green
} else {
    # 首次：从版本号计算初始值 major*10000 + minor*100 + patch
    $newVersionCode = [int]$versionParts[0] * 10000 + [int]$versionParts[1] * 100 + [int]$versionParts[2]
    $propsContent += "`nandroid.versionCode=$newVersionCode"
    [System.IO.File]::WriteAllText($gradlePropsPath, $propsContent)
    Write-Host "  versionCode: $newVersionCode (new, computed from version)" -ForegroundColor Green
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  [8/8] Gradle 构建
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n[8/8] Building Release APK..." -ForegroundColor Yellow

$androidDir = Join-Path $ScriptDir "android"
Push-Location $androidDir
try {
    $env:NODE_ENV = "production"
    $archsArg = ($architectures -join ',')
    $savedEAP = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    .\gradlew.bat assembleRelease "-PreactNativeArchitectures=$archsArg" 2>&1 | ForEach-Object {
        if ($_ -is [System.Management.Automation.ErrorRecord]) {
            Write-Host $_.ToString() -ForegroundColor Gray
        } else {
            $line = $_ -as [string]
            if ($line) { Write-Host $line }
        }
    }
    $ErrorActionPreference = $savedEAP
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Build FAILED!" -ForegroundColor Red
        exit 1
    }
} finally {
    $ErrorActionPreference = $savedEAP
    Pop-Location
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  构建结果验证
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Build Result Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$apkDir = Join-Path $ScriptDir "android\app\build\outputs\apk\release"
$apks = Get-ChildItem -Path $apkDir -Filter "*.apk" -ErrorAction SilentlyContinue

if ($apks.Count -eq 0) {
    Write-Host "  No APK found!" -ForegroundColor Red
    exit 1
}

foreach ($apk in $apks) {
    $sizeMB = [math]::Round($apk.Length / 1MB, 2)
    Write-Host "  APK: $($apk.Name)  $sizeMB MB" -ForegroundColor White

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
        Write-Host "  Architecture: arm64-v8a only  OK" -ForegroundColor Green
    } else {
        Write-Host "  Architecture: $libDirs  WARNING" -ForegroundColor Red
    }
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  自动复制 APK 到项目 apk/ 目录
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n  Copying APK to apk/ directory..." -ForegroundColor Yellow
$outputDir = Join-Path $ScriptDir "apk"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "  Created apk/ directory" -ForegroundColor Green
}
foreach ($apk in $apks) {
    $destPath = Join-Path $outputDir $apk.Name
    Copy-Item $apk.FullName $destPath -Force
    $sizeMB = [math]::Round((Get-Item $destPath).Length / 1MB, 2)
    Write-Host "  Copied: apk\$($apk.Name)  $sizeMB MB" -ForegroundColor Green
}

Write-Host "  Version: $newVersion (versionCode=$newVersionCode)" -ForegroundColor Green
Write-Host "`nBuild complete!" -ForegroundColor Green
