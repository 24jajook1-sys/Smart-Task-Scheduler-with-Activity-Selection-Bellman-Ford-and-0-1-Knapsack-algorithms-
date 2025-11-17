# 🚀 GitHub Upload Guide - Smart Task Scheduler

## Step-by-Step Instructions to Upload to GitHub

---

## ✅ Prerequisites

1. **Git installed** on your system
   - Download from: https://git-scm.com/downloads
   - Verify: `git --version`

2. **GitHub account** created
   - Sign up at: https://github.com

---

## 📋 Method 1: Using Git Command Line (Recommended)

### Step 1: Initialize Git Repository

Open PowerShell in your project folder:

```powershell
cd e:\DAA2
git init
```

### Step 2: Add All Files

```powershell
git add .
```

### Step 3: Create Initial Commit

```powershell
git commit -m "Initial commit: Smart Task Scheduler with 3 algorithms"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `smart-task-scheduler` (or your choice)
3. Description: "Web-based task scheduler using Activity Selection, Bellman-Ford & 0/1 Knapsack algorithms"
4. Choose **Public** or **Private**
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 5: Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/smart-task-scheduler.git
git branch -M main
git push -u origin main
```

### Step 6: Enter Credentials

When prompted:
- Enter your GitHub username
- Enter your Personal Access Token (PAT) as password
  - Get PAT at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control)

---

## 📋 Method 2: Using GitHub Desktop (Easiest)

### Step 1: Install GitHub Desktop

Download from: https://desktop.github.com/

### Step 2: Add Repository

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose folder: `e:\DAA2`
4. Click "Add Repository"

### Step 3: Create Initial Commit

1. Review changes in left panel
2. Enter commit message: "Initial commit: Smart Task Scheduler"
3. Click "Commit to main"

### Step 4: Publish to GitHub

1. Click "Publish repository" button
2. Choose repository name: `smart-task-scheduler`
3. Add description
4. Choose Public/Private
5. Click "Publish Repository"

Done! Your project is now on GitHub.

---

## 📋 Method 3: Using VS Code (If you use VS Code)

### Step 1: Open Folder in VS Code

```powershell
cd e:\DAA2
code .
```

### Step 2: Initialize Repository

1. Click Source Control icon (left sidebar)
2. Click "Initialize Repository"

### Step 3: Stage and Commit

1. Click "+" next to "Changes" to stage all files
2. Enter commit message: "Initial commit: Smart Task Scheduler"
3. Click checkmark ✓ to commit

### Step 4: Publish to GitHub

1. Click "Publish to GitHub" button
2. Choose repository name
3. Select Public/Private
4. Click "Publish"

---

## 🔧 Troubleshooting

### Issue: "Git is not recognized"

**Solution:** Install Git from https://git-scm.com/downloads

### Issue: "Authentication failed"

**Solution:** 
1. Create Personal Access Token (PAT)
2. Go to: https://github.com/settings/tokens
3. Generate new token (classic)
4. Select `repo` scope
5. Use PAT as password (not your GitHub password)

### Issue: "Remote origin already exists"

**Solution:**
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
```

### Issue: "Permission denied"

**Solution:**
```powershell
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/your-repo.git
```

---

## ✅ Verification

After uploading, verify:

1. Visit your GitHub repository
2. Check all files are present:
   - ✅ frontend/ folder
   - ✅ algorithms/ folder
   - ✅ assets/ folder
   - ✅ All .md documentation files
   - ✅ README.md displays nicely

---

## 🎨 Optional: Add GitHub Pages (Live Demo)

Make your app accessible online!

### Step 1: Enable GitHub Pages

1. Go to repository Settings
2. Scroll to "Pages" section
3. Source: Deploy from branch
4. Branch: `main`
5. Folder: `/ (root)`
6. Click Save

### Step 2: Wait 2-3 Minutes

GitHub builds your site automatically.

### Step 3: Access Your Live Site

```
https://YOUR_USERNAME.github.io/smart-task-scheduler/frontend/index.html
```

Or create `index.html` in root that redirects to `frontend/index.html`

---

## 📝 Quick Commands Reference

```powershell
# Check status
git status

# Add specific file
git add filename.txt

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## 🏆 Best Practices

### Good Commit Messages:
- ✅ "Add Gantt chart visualization"
- ✅ "Fix circular dependency detection"
- ✅ "Update README with installation steps"
- ❌ "fix bug"
- ❌ "update"

### When to Commit:
- After completing a feature
- Before starting major changes
- When code is working
- End of work session

### What to Include in README:
- [x] Project description
- [x] Features list
- [x] Installation instructions
- [x] Usage examples
- [x] Screenshots (optional)
- [x] Technologies used
- [x] License information

---

## 📸 Optional: Add Screenshots

Enhance your GitHub repository:

1. Take screenshots of your application
2. Create `screenshots/` folder
3. Add images: `screenshot1.png`, `screenshot2.png`
4. Update README.md:

```markdown
## Screenshots

![Main Interface](screenshots/screenshot1.png)
![Results Dashboard](screenshots/screenshot2.png)
```

---

## 🌟 Make Your Repository Stand Out

### Add Repository Topics:

1. Go to your repository
2. Click ⚙️ next to "About"
3. Add topics:
   - `javascript`
   - `task-scheduler`
   - `algorithm`
   - `data-structures`
   - `dynamic-programming`
   - `greedy-algorithm`
   - `web-application`
   - `chart-js`
   - `html-css-javascript`

### Add Description:

"Web-based Smart Task Scheduler using Activity Selection, Bellman-Ford, and 0/1 Knapsack algorithms for optimal task scheduling with interactive Gantt charts and visualizations."

### Add Website Link:

If using GitHub Pages, add the live demo URL.

---

## 📦 Your Repository Structure Will Look Like:

```
smart-task-scheduler/
├── .gitignore
├── README.md
├── LICENSE (optional)
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── algorithms/
│   ├── activity_selection.c
│   ├── bellman_ford.py
│   └── knapsack.py
├── assets/
│   └── test_data_*.json
└── [All documentation files]
```

---

## 🎓 After Uploading

### Share Your Project:
- Add link to your resume/portfolio
- Share on LinkedIn
- Include in project presentations
- Show during interviews

### Keep It Updated:
```powershell
# After making changes
git add .
git commit -m "Description of changes"
git push origin main
```

---

## ✅ Complete Command Sequence

**Copy and paste these commands (replace YOUR_USERNAME):**

```powershell
# Navigate to project
cd e:\DAA2

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Smart Task Scheduler with Activity Selection, Bellman-Ford, and 0/1 Knapsack algorithms"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/smart-task-scheduler.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🎉 Congratulations!

Your Smart Task Scheduler is now on GitHub!

**Next Steps:**
1. Share your repository link
2. Add it to your portfolio
3. Continue improving the project
4. Accept contributions from others

**Your repository URL will be:**
```
https://github.com/YOUR_USERNAME/smart-task-scheduler
```

---

## 📞 Need Help?

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **GitHub Support:** https://support.github.com

**Happy coding! 🚀**
