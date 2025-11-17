# Smart Task Scheduler - GitHub Upload Script
# Run this script to upload your project to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Smart Task Scheduler - GitHub Upload" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Configure Git User
Write-Host "Step 1: Configure Git User Information" -ForegroundColor Yellow
Write-Host ""

$userName = Read-Host "Enter your name (e.g., John Doe)"
$userEmail = Read-Host "Enter your email (e.g., john@example.com)"

git config --global user.name "$userName"
git config --global user.email "$userEmail"

Write-Host ""
Write-Host "Git user configured successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Create Initial Commit
Write-Host "Step 2: Creating Initial Commit" -ForegroundColor Yellow
git commit -m "Initial commit: Smart Task Scheduler with Activity Selection, Bellman-Ford, and 0/1 Knapsack algorithms"

Write-Host ""
Write-Host "Initial commit created!" -ForegroundColor Green
Write-Host ""

# Step 3: Get GitHub Repository URL
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Create GitHub Repository" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now, go to GitHub and create a new repository:" -ForegroundColor White
Write-Host ""
Write-Host "1. Open: https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: smart-task-scheduler" -ForegroundColor White
Write-Host "3. Description: Web-based task scheduler using 3 algorithms" -ForegroundColor White
Write-Host "4. Choose Public or Private" -ForegroundColor White
Write-Host "5. Do NOT initialize with README" -ForegroundColor White
Write-Host "6. Click 'Create repository'" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you created the repository? (yes/no)"

if ($continue -ne "yes") {
    Write-Host ""
    Write-Host "Please create the repository first, then run this script again." -ForegroundColor Red
    exit
}

Write-Host ""
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/smart-task-scheduler.git)"

# Step 4: Add Remote and Push
Write-Host ""
Write-Host "Step 4: Connecting to GitHub and Pushing" -ForegroundColor Yellow
Write-Host ""

git remote add origin $repoUrl
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "(You may be prompted for credentials)" -ForegroundColor White
Write-Host ""

git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUCCESS! Project Uploaded to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your repository:" -ForegroundColor White
Write-Host $repoUrl.Replace(".git", "") -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit your repository URL" -ForegroundColor White
Write-Host "2. Enable GitHub Pages in Settings > Pages" -ForegroundColor White
Write-Host "3. Add repository topics for better visibility" -ForegroundColor White
Write-Host "4. Share your project link!" -ForegroundColor White
Write-Host ""
Write-Host "Need help? Check GITHUB_UPLOAD_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
