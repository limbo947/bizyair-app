# scripts/patch-android-build.ps1
# Post-prebuild patching: apply configs not supported by expo-build-properties plugin

param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..")
)

$ErrorActionPreference = "Stop"
$androidDir = Join-Path $ProjectRoot "android"

if (-not (Test-Path $androidDir)) {
    Write-Host "[patch] ERROR: android/ directory not found" -ForegroundColor Red
    exit 1
}

# ── 1. 写入完整 ProGuard 规则 ──────────────────────────────────
Write-Host "[patch] Writing ProGuard rules..." -ForegroundColor Yellow
$proguardFile = Join-Path $androidDir "app\proguard-rules.pro"
$proguardContent = @'
# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.proguard.annotations.KeepGettersAndSetters *;
}
-dontwarn com.facebook.hermes.**
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native New Architecture (TurboModules + Fabric)
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }

# Expo Modules
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# OKHTTP
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# jssha
-keep class js.** { *; }

# Remove verbose logging in Release
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}
'@
[System.IO.File]::WriteAllText($proguardFile, $proguardContent)
Write-Host "  ProGuard rules written" -ForegroundColor Green

# ── 2. 配置 gradle.properties ──────────────────────────────────
Write-Host "[patch] Configuring gradle.properties..." -ForegroundColor Yellow
$propsPath = Join-Path $androidDir "gradle.properties"

if (-not (Test-Path $propsPath)) {
    Write-Host "  gradle.properties not found, skipping" -ForegroundColor Yellow
} else {
    $props = Get-Content $propsPath -Raw

    # Remove deprecated properties
    $props = $props -replace "expo\.edgeToEdgeEnabled=.*\r?\n?", ""
    $props = $props -replace "react\.nativeArchitectures=.*\r?\n?", ""

    # Ensure android.versionCode exists (fallback for first-time builds)
    if ($props -notmatch "android\.versionCode=") {
        $fallbackCode = "1"
        $appJsonFile = Join-Path $ProjectRoot "app.json"
        if (Test-Path $appJsonFile) {
            try {
                $appJson = Get-Content $appJsonFile -Raw | ConvertFrom-Json
                $ver = $appJson.expo.version
                if ($ver) { $fallbackCode = ($ver -split '\.')[-1] }
            } catch {}
        }
        $props += "`nandroid.versionCode=$fallbackCode"
    }

    [System.IO.File]::WriteAllText($propsPath, $props)
    Write-Host "  gradle.properties configured" -ForegroundColor Green
}

# ── 3. 修补 AndroidManifest.xml ─────────────────────────────────
Write-Host "[patch] Patching AndroidManifest.xml..." -ForegroundColor Yellow
$manifestPath = Join-Path $androidDir "app\src\main\AndroidManifest.xml"

if (-not (Test-Path $manifestPath)) {
    Write-Host "  AndroidManifest.xml not found, skipping" -ForegroundColor Yellow
} else {
    $manifest = Get-Content $manifestPath -Raw

    # Fix allowBackup security issue
    $manifest = $manifest -replace 'android:allowBackup="true"', 'android:allowBackup="false"'

    # Add tools:replace to ensure allowBackup override
    if ($manifest -notmatch 'tools:replace="android:allowBackup"') {
        $manifest = $manifest -replace '(<application[^>]*?)>', ('$1' + ' tools:replace="android:allowBackup">')
    }

    [System.IO.File]::WriteAllText($manifestPath, $manifest)
    Write-Host "  allowBackup=false configured" -ForegroundColor Green
}

# ── 4. 修补 build.gradle（签名 + versionCode + APK命名） ──────
Write-Host "[patch] Patching build.gradle..." -ForegroundColor Yellow
$buildGradlePath = Join-Path $androidDir "app\build.gradle"
$keystorePropsPath = Join-Path $androidDir "keystore.properties"

if (-not (Test-Path $buildGradlePath)) {
    Write-Host "  build.gradle not found, skipping" -ForegroundColor Yellow
} else {
    $buildGradle = Get-Content $buildGradlePath -Raw
    $modified = $false

    # 4a. Inject keystore loading block (before android { block)
    if ($buildGradle -notmatch "keystorePropertiesFile") {
        $keystoreBlock = @'

def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
'@
        $buildGradle = $buildGradle -replace '(?=android\s*\{)', ($keystoreBlock + "`n`n")
        $modified = $true
    }

    # 4b. Inject release signing config
    if ($buildGradle -match 'signingConfigs\s*\{' -and $buildGradle -notmatch 'signingConfigs\.release') {
        $releaseSigning = @'
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile rootProject.file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
'@
        $buildGradle = $buildGradle -replace '(signingConfigs\s*\{[\s\S]*?)(debug\s*\{[\s\S]*?\})', ('$1$2' + "`n" + $releaseSigning)
        $modified = $true
    }

    # 4c. Switch release buildType to use release signing config
    if ($buildGradle -match 'release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.debug') {
        $buildGradle = $buildGradle -replace 'signingConfig\s+signingConfigs\.debug', 'signingConfig keystorePropertiesFile.exists() ? signingConfigs.release : signingConfigs.debug'
        $modified = $true
    }

    # 4d. Make versionCode read from gradle.properties
    if ($buildGradle -match "versionCode\s+\d+") {
        $buildGradle = $buildGradle -replace "versionCode\s+\d+", "versionCode Integer.parseInt(findProperty('android.versionCode') ?: '1')"
        $modified = $true
    }

    # 4e. Custom APK filename (include version number)
    if ($buildGradle -notmatch 'outputFileName') {
        $apkNamingBlock = @'

android.applicationVariants.all { variant ->
    variant.outputs.all { output ->
        def appName = "bizyair-assistant"
        def version = variant.versionName
        output.outputFileName = "${appName}-v${version}-${variant.buildType.name}.apk"
    }
}
'@
        $buildGradle = $buildGradle -replace '(?=dependencies\s*\{)', ($apkNamingBlock + "`n")
        $modified = $true
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($buildGradlePath, $buildGradle)
        Write-Host "  build.gradle patched (signing + versionCode + APK naming)" -ForegroundColor Green
    } else {
        Write-Host "  build.gradle already patched" -ForegroundColor Green
    }
}

Write-Host "[patch] All patches applied successfully!" -ForegroundColor Green
