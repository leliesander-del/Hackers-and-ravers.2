# Eenmalige setup: Node (lokaal in .tools) + npm install
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$toolsDir = Join-Path $root ".tools"
$nodeDir = Join-Path $toolsDir "node"
$npm = Join-Path $nodeDir "npm.cmd"

function Ensure-LocalNode {
  if (Test-Path $npm) {
    Write-Host "Lokale Node.js staat al in .tools\node"
    return
  }

  $globalNpm = "C:\Program Files\nodejs\npm.cmd"
  if (Test-Path $globalNpm) {
    Write-Host "Systeem-Node.js gevonden — lokale download overgeslagen."
    Write-Host "Je kunt gewoon 'npm install' en 'npm run dev' gebruiken in een nieuwe terminal."
    return
  }

  New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
  $zip = Join-Path $toolsDir "node.zip"
  $url = "https://nodejs.org/dist/v22.22.0/node-v22.22.0-win-x64.zip"
  Write-Host "Node.js portable downloaden (~35 MB)..."
  Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  Expand-Archive -Path $zip -DestinationPath $toolsDir -Force
  $extracted = Join-Path $toolsDir "node-v22.22.0-win-x64"
  if (Test-Path $extracted) {
    if (Test-Path $nodeDir) { Remove-Item $nodeDir -Recurse -Force }
    Rename-Item $extracted "node"
  }
  Remove-Item $zip -Force -ErrorAction SilentlyContinue
  Write-Host "Node.js geïnstalleerd in .tools\node"
}

function Get-NpmCmd {
  if (Test-Path $npm) { return $npm }
  $globalNpm = "C:\Program Files\nodejs\npm.cmd"
  if (Test-Path $globalNpm) { return $globalNpm }
  $cmd = Get-Command npm -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

Ensure-LocalNode
$npmCmd = Get-NpmCmd
if (-not $npmCmd) {
  Write-Host "Kon npm niet vinden na setup." -ForegroundColor Red
  exit 1
}

Push-Location $root
Write-Host "Dependencies installeren..."
& $npmCmd install
Write-Host ""
Write-Host "Klaar! Start de app met:" -ForegroundColor Green
Write-Host "  .\scripts\dev.ps1"
Write-Host "of (als npm in PATH staat): npm run dev"
Pop-Location
