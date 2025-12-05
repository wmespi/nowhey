# Development Workflow: Feature Branches & Preview Deployments

To safely test changes without breaking the live site (`main`), we use a **Feature Branch** workflow. Vercel automatically supports this!

## The Concept
1.  **Production (`main`)**: This is your live website. Don't push here directly unless it's a tiny fix.
2.  **Feature Branches**: Create a separate copy of the code for each new feature (e.g., `feature/dark-mode`).
3.  **Preview Deployments**: When you push a branch to GitHub, Vercel automatically builds it and gives you a unique **Preview URL** (e.g., `nowhey-git-feature-dark-mode.vercel.app`).
4.  **Merge**: Once you test the Preview URL and it looks good, you merge the branch into `main`, and Vercel updates the live site.

## Step-by-Step Guide

### 1. Start a New Feature
Before making changes, create a new branch.
```bash
# Make sure you are on the latest main
git checkout main
git pull origin main

# Create and switch to a new branch
git checkout -b feature/my-new-feature
```

### 2. Make Changes
Code as usual.
```bash
# ... edit files ...
git add .
git commit -m "Added cool new feature"
```

### 3. Push to GitHub
Push your new branch up.
```bash
git push -u origin feature/my-new-feature
```

### 4. Test the Preview
1.  Go to your **Vercel Dashboard**.
2.  You will see a new deployment for your branch.
3.  Click it to visit the **Preview URL**.
4.  Test everything here. It connects to your real backend/database (unless you configure separate Preview environment variables), but it doesn't affect the live URL users see.

### 5. Merge to Production
If the preview looks good:
1.  Go to **GitHub**.
2.  Create a **Pull Request** (PR) from `feature/my-new-feature` to `main`.
3.  Merge the PR.
4.  Vercel will detect the change to `main` and automatically update the live site.

### 6. Cleanup
Delete the branch locally and on GitHub to keep things clean.
```bash
git checkout main
git pull origin main
git branch -d feature/my-new-feature
```
