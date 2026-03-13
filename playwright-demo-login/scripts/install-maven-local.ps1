$ErrorActionPreference = 'Stop'

$version = '3.9.13'
$zipUrl = "https://archive.apache.org/dist/maven/maven-3/$version/binaries/apache-maven-$version-bin.zip"
$baseDir = 'C:\Users\Admin\tools'
$installDir = Join-Path $baseDir "apache-maven-$version"
$zipPath = Join-Path $env:TEMP "apache-maven-$version-bin.zip"
$javaHome = 'C:\Program Files\Java\jdk-21'

New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

if (-not (Test-Path $installDir)) {
  Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
  Expand-Archive -Path $zipPath -DestinationPath $baseDir -Force
}

[Environment]::SetEnvironmentVariable('MAVEN_HOME', $installDir, 'User')

if (Test-Path $javaHome) {
  [Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'User')
}

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$mavenBin = Join-Path $installDir 'bin'
$javaBin = if (Test-Path $javaHome) { Join-Path $javaHome 'bin' } else { $null }

$parts = @()
if ($mavenBin) { $parts += $mavenBin }
if ($javaBin) { $parts += $javaBin }
if ($userPath) { $parts += ($userPath -split ';' | Where-Object { $_.Trim() }) }

$normalized = @()
foreach ($part in $parts) {
  if (-not ($normalized | Where-Object { $_.TrimEnd('\') -ieq $part.TrimEnd('\') })) {
    $normalized += $part
  }
}

[Environment]::SetEnvironmentVariable('Path', ($normalized -join ';'), 'User')

$env:MAVEN_HOME = $installDir
if (Test-Path $javaHome) {
  $env:JAVA_HOME = $javaHome
}
$env:Path = "$mavenBin;$javaBin;$env:Path"

Write-Output "INSTALL_DIR=$installDir"
Write-Output "MAVEN_HOME=$env:MAVEN_HOME"
Write-Output "JAVA_HOME=$env:JAVA_HOME"
mvn -version
