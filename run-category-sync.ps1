param(
    [string]$Username = "laboulangerie",
    [string]$Password = "livefsr@1",
    [string]$Location = "La Boulangerie 2",
    [string]$CategoriesFile = "C:\Users\Admin\Downloads\Category.txt"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$jarFiles = Get-ChildItem -Path ".\libs" -Filter "*.jar" | Where-Object {
    $_.Name -notlike "selenium-server-standalone*" -and $_.Name -notlike "*-sources.jar"
}

if (-not $jarFiles) {
    throw "No runtime jars found in .\libs"
}

$classPath = (($jarFiles | ForEach-Object { $_.FullName }) + (Join-Path $projectRoot "src")) -join ";"
$javaFile = Join-Path $projectRoot "src\CategorySyncAutomation.java"

Write-Host "Compiling CategorySyncAutomation.java..."
$compileArgs = @("-cp", $classPath, $javaFile)
& javac @compileArgs

Write-Host "Running automation..."
$runArgs = @(
    "-Xint",
    "-Xms64m",
    "-Xmx256m",
    "-cp", $classPath,
    "-Dapp.username=$Username",
    "-Dapp.password=$Password",
    "-Dapp.location=$Location",
    "-Dcategories.file=$CategoriesFile",
    "CategorySyncAutomation"
)
& java @runArgs
