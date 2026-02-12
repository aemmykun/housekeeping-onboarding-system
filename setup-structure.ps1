# Quick Setup Script - Creates project structure only
Write-Host "`n🏨 Creating Housekeeping Onboarding Project Structure...`n" -ForegroundColor Cyan

$folders = @(
    "frontend/src/components/Auth",
    "frontend/src/components/Dashboard",
    "frontend/src/components/Modules",
    "frontend/src/components/Gamification",
    "frontend/src/components/AR",
    "frontend/src/components/Social",
    "frontend/src/pages",
    "frontend/src/contexts",
    "frontend/src/utils",
    "frontend/src/styles",
    "frontend/public/images",
    "frontend/public/icons",
    "backend/models",
    "backend/routes",
    "backend/middleware",
    "backend/controllers",
    "backend/config",
    "backend/services",
    "backend/utils",
    "database/schemas",
    "database/seeders",
    "database/migrations",
    "docs/api",
    "docs/deployment",
    "docs/user-guide",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    "deployment/docker",
    "scripts"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    Write-Host "✓ Created: $folder" -ForegroundColor Green
}

Write-Host "`n✅ Project structure created successfully!" -ForegroundColor Green
Write-Host "`n📝 Next: Run the full package.ps1 script after installing Node.js" -ForegroundColor Yellow
