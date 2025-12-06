# Development Workflow: Feature Branches & Preview Deployments

To safely test changes without breaking the live site (`main`), we use a **Feature Branch** workflow. Vercel automatically supports this!

## The Concept
1.  **Production (`main`)**: This is your live website. It is locked and stable.
2.  **Staging (`develop`)**: This is where we merge features for final testing on Vercel.
3.  **Feature Branches**: Create a separate copy for each new feature (e.g., `feature/dark-mode`).

## Strict Git Flow
We follow a strict promotion process to ensure stability:
1.  **Feature Branch** (Dev DB) -> PR -> **Develop Branch** (Dev DB)
2.  **Test on Vercel Preview** (Develop URL)
3.  **Develop Branch** -> PR -> **Main Branch** (Prod DB)

## Step-by-Step Guide

### 1. Start a New Feature
**Always** branch off `develop`.
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

### 2. Make Changes & Verify Locally
Code, build, and test locally.
```bash
# Code...
npm run build
npm run preview
git add .
git commit -m "Added cool new feature"
```

### 3. Push to GitHub
```bash
git push -u origin feature/my-new-feature
```

### 4. Merge to Develop (Staging)
1.  **Switch to develop:** `git checkout develop`
2.  **Pull latest:** `git pull origin develop`
3.  **Merge feature:** `git merge feature/my-new-feature`
4.  **Push:** `git push origin develop`
5.  **WAIT**: Vercel will deploy the `develop` branch to a specific Preview URL.

### 5. Test Staging (Crucial Step)
1.  Open the Vercel Preview URL for the `develop` branch.
2.  Verify the feature works with the **Dev Database**.
3.  If it fails here, fix it and push to `develop` again.

### 6. Release to Production
Once `develop` is verified and stable:
1.  Create a **Pull Request** from `develop` to `main`.
2.  **Merge it.**
3.  Vercel updates the live site (Production Database).

### 7. Cleanup
```bash
git branch -d feature/my-new-feature
```

## Environment Variables (Vercel)
We have configured Vercel to use different databases for different branches:
*   **Production (`main`)**: Uses `nowhey - PROD` (Prod DB).
*   **Preview (`develop` & feature branches)**: Uses `nowhey - DEV` (Dev DB).
