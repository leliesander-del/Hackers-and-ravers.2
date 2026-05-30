# Start de StoreNav dev-server (gebruikt lokale Node in .tools als npm niet in PATH staat)
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Get-NpmCmd {
  $local = Join-Path $root ".tools\node\npm.cmd"
  if (Test-Path $local) { return $local }
  $global = "C:\Program Files\nodejs\npm.cmd"
  if (Test-Path $global) { return $global }
  $cmd = Get-Command npm -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

$npm = Get-NpmCmd
if (-not $npm) {
  Write-Host "Node.js/npm niet gevonden. Voer eerst uit: .\scripts\setup.ps1" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path (Join-Path $root "node_modules"))) {
  Write-Host "node_modules ontbreekt — dependencies installeren..."
  Push-Location $root
  & $npm install
  Pop-Location
}

Push-Location $root
& $npm run dev
Pop-Location
