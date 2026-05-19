# Automatic Multi-Site Deployment Guide

## 🚀 How It Works

1. **Create sites** in your DerivForge management dashboard
2. **Push to GitHub** - automatic deployment triggers
3. **Each site builds** with its own App ID and colors
4. **Deployed automatically** - no manual steps!

## ⚙️ One-Time Setup

### 1. Add GitHub Secrets

Go to your GitHub repo: `https://github.com/bigmanhantamx/manager`
→ Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

```
APPWRITE_PROJECT_ID = 6965d79a00369a35059d
APPWRITE_DATABASE_ID = 6965ec2f00042519d706
APPWRITE_API_KEY = standard_10194920d5be9e12cc948c7ca726bb5d8243467e77aa4403ed56d3453d03dc37dcc5b51ba65c7413ded92558f82ad068b85bce804f2cbdf68fbbd6c292766c9b4a176736e5936c84a14ce96d9532b3c08dd054b5422345c07119c6b7654590b70b686d79228592bc511954330ee1e89b018ce6a847aabf5f990665868cd03253
```

### 2. Push the Workflow

```bash
cd "C:\Users\Duncan Mghosi\Desktop\my deriv affiliates websites\dbotspace"
git add .github/workflows/multi-site-deploy.yml
git commit -m "Add automatic multi-site deployment"
git push
```

## 📋 Usage

### Creating a New Site

1. Open DerivForge: `http://localhost:3000/deployments`
2. Click **"+ Create New Site"**
3. Fill in the form:
   - Site Name: "My Custom Bot"
   - App ID: Your Deriv API App ID
   - Colors: Pick your brand colors
   - Domain: Your custom domain (optional)
4. Click **"Create Site Configuration"**

### Automatic Deployment

**That's it!** When you push to GitHub:

✅ GitHub Actions reads ALL site configs from database  
✅ Builds each site with its unique App ID & colors  
✅ Creates separate deployments for each site  
✅ No manual steps required!

### Viewing Deployments

- Go to GitHub → Actions tab
- See all sites being built in parallel
- Download build artifacts for each site

## 🎨 How Configs Are Applied

Each site automatically gets:

- **App ID**: From your configuration
- **Primary Color**: Applied to buttons, links, highlights  
- **Secondary Color**: Applied to accents, hover states  
- **Site Name**: Shown in the title and branding  
- **Domain**: Used for routing (if applicable)

## 🔄 Updating a Site

1. Edit the site in DerivForge
2. Save changes
3. Push any code change to GitHub
4. All sites rebuild with updated configs!

## 🛠️ Manual Deployment

Trigger deployment without code changes:

1. Go to GitHub → Actions
2. Click "Multi-Site Deployment"
3. Click "Run workflow"
4. Choose branch: `master`
5. Click "Run workflow"

## ❓ Troubleshooting

### Build Failing?

- Check GitHub Secrets are set correctly
- Verify App ID is valid
- Check build logs in GitHub Actions

### Colors Not Applying?

- Ensure colors are in hex format: `#ff444f`
- Check `scripts/build-config.js` is running
- Verify `src/styles/build-vars.scss` is generated

### Site Not Found?

- Verify site config exists in database
- Check DerivForge dashboard shows the site
- Confirm database ID matches in GitHub Secrets

## 📊 Architecture

```
DerivForge UI
    ↓ (creates config)
Appwrite Database
    ↓ (GitHub Actions reads)
Build Script
    ↓ (applies configs)
Multiple Site Builds
    ↓ (deployed)
Appwrite Hosting / CDN
```

## 🎯 Benefits

✅ **One codebase, unlimited sites**  
✅ **Each with unique App ID**  
✅ **Custom branding per site**  
✅ **Fully automated deployments**  
✅ **No manual configuration**  
✅ **Database-driven**  

## 📝 Notes

- Builds run in parallel (faster!)
- Each site is independent
- Configs stored securely in Appwrite
- No environment variables needed in Appwrite Console
- Everything reads from the database automatically!
