# GitHub Setup Instructions

## Step 1: Create a Repository on GitHub

1. Go to https://github.com and log in to your account
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "job-swap-platform" or "cursor-job-swap-main")
5. Choose if you want it to be Public or Private
6. DO NOT initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Copy the Repository URL

After creating the repository, GitHub will show you the repository URL. It will look like:
- `https://github.com/YOUR_USERNAME/REPO_NAME.git` (HTTPS)
- or `git@github.com:YOUR_USERNAME/REPO_NAME.git` (SSH)

## Step 3: Connect and Push Your Code

Run these commands in your terminal (replace with your actual repository URL):

```bash
cd "/Users/krishnagoyal/Desktop/projects /cursor-job-swap-main"

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using GitHub CLI (if installed)

If you have GitHub CLI installed, you can run:

```bash
gh repo create job-swap-platform --public --source=. --remote=origin --push
```

## Troubleshooting

If you get authentication errors:
- For HTTPS: You may need a Personal Access Token instead of password
- For SSH: Make sure your SSH key is added to GitHub

To set up SSH key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
