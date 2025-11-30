<#
PowerShell deploy script for GitHub Pages using git worktree.

Usage:
  .\deploy.ps1 -Repo https://github.com/the-knueppels/qa-resume.git -Branch gh-pages

Defaults:
  Repo: remote 'origin' (if set locally); or you can provide -Repo
  Branch: 'gh-pages'
#>
param(
  [string]$Repo = '',
  [string]$Branch = 'gh-pages',
  [switch]$Force
)

$ScriptDir = (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)
Set-Location $ScriptDir

function Assert-GitRepo {
  $git = Get-Command git -ErrorAction SilentlyContinue
  if (-not $git) { throw 'git not found in PATH' }
  $isRepo = & git rev-parse --is-inside-work-tree 2>$null
  if ($LASTEXITCODE -ne 0) { throw 'This folder is not a git repository'; }
}

try {
  Assert-GitRepo
} catch {
  Write-Error $_.Exception.Message
  exit 1
}

# If Repo not provided, try to infer from origin
if (-not $Repo) {
  $originUrl = (& git remote get-url origin 2>$null)
  if ($LASTEXITCODE -eq 0 -and $originUrl) { $Repo = $originUrl } else { Write-Warning 'Repo URL not provided and remote origin not found; the script will try to push to origin if present'; }
}

$worktreeDir = Join-Path $ScriptDir '_deploy'

Write-Output "Preparing deploy to branch: $Branch"

# Remove old worktree if exists
if (Test-Path $worktreeDir) {
  Write-Output "Removing existing worktree at $worktreeDir..."
  & git worktree remove $worktreeDir -f 2>$null
  Remove-Item -Recurse -Force $worktreeDir -ErrorAction SilentlyContinue
}

# Create or checkout branch in a new worktree
Write-Output "Creating/checkout worktree for $Branch"
& git worktree add -B $Branch $worktreeDir 2>$null
if ($LASTEXITCODE -ne 0) {
  # fallback: create orphan branch
  Write-Output "Creating orphan branch $Branch"
  & git worktree add $worktreeDir
  Push-Location $worktreeDir
  & git checkout --orphan $Branch
  Pop-Location
}

# Clean the worktree except .git references
Write-Output "Cleaning worktree directory"
Get-ChildItem -Path $worktreeDir -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# Copy new site files into worktree
Write-Output "Copying site files"
$exclude = @('.git', '.github', 'deploy.ps1', '_deploy')
Get-ChildItem -Path $ScriptDir -File -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object { Copy-Item -Path $_.FullName -Destination $worktreeDir -Force }
Get-ChildItem -Path $ScriptDir -Directory -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object { Copy-Item -Path $_.FullName -Destination $worktreeDir -Recurse -Force }

# Commit and push
Push-Location $worktreeDir
& git add -A
$diff = & git status --porcelain
if ($diff) {
  & git commit -m "deploy: publish site on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  if ($LASTEXITCODE -ne 0) { Write-Warning 'Commit failed'; }
  $pushTarget = $Repo ? $Repo : 'origin'
  Write-Output "Pushing to $pushTarget/$Branch"
  if ($Force) { & git push $pushTarget $Branch --force } else { & git push $pushTarget $Branch }
} else {
  Write-Output "No changes to deploy."
}
Pop-Location

# Remove the worktree
Write-Output "Cleaning up worktree"
& git worktree remove $worktreeDir -f 2>$null
Remove-Item -Recurse -Force $worktreeDir -ErrorAction SilentlyContinue

Write-Output "Deployment complete."
