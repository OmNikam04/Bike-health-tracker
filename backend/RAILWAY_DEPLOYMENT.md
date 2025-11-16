# 🚀 Railway Deployment Guide

Complete guide to deploy Bike Health Tracker backend to Railway.app

---

## 📋 Prerequisites

- GitHub account
- Railway account (free tier)
- Your backend code pushed to GitHub

---

## 🎯 Step-by-Step Deployment

### **Step 1: Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login with GitHub"**
3. Authorize Railway to access your GitHub account

---

### **Step 2: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `bike-health-tracker` repository
4. Railway will detect your project automatically

---

### **Step 3: Add PostgreSQL Database**

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL database automatically
4. Note: Database credentials are auto-generated

---

### **Step 4: Configure Environment Variables**

1. Click on your **backend service** (not the database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add the following:

```bash
# Server Configuration
PORT=8080
ENV=production

# Database Configuration (Railway provides these automatically)
# Click "Add Reference" and select PostgreSQL variables:
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_SSLMODE=require

# JWT Configuration (IMPORTANT: Change these!)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=168h

# CORS Configuration
CORS_ORIGINS=*

# Log Level
LOG_LEVEL=info
```

**⚠️ IMPORTANT:** 
- Generate a strong `JWT_SECRET` (at least 32 characters)
- You can use: `openssl rand -base64 32` to generate one

---

### **Step 5: Configure Build Settings**

1. In your backend service, go to **"Settings"** tab
2. Scroll to **"Build"** section
3. Set **Root Directory** to: `backend`
4. Railway will automatically use `Dockerfile.prod`

---

### **Step 6: Deploy**

1. Railway will automatically deploy after configuration
2. Wait for build to complete (~2-5 minutes)
3. Check **"Deployments"** tab for progress
4. Look for ✅ **"Success"** status

---

### **Step 7: Get Your API URL**

1. Go to **"Settings"** tab of your backend service
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `your-app.up.railway.app`
5. Your API will be available at: `https://your-app.up.railway.app/api/v1`

---

### **Step 8: Test Your Deployment**

Test your API endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/api/v1/health

# Signup
curl -X POST https://your-app.up.railway.app/api/v1/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

---

## 🔧 Troubleshooting

### Build Fails
- Check **"Deployments"** → **"View Logs"**
- Ensure `Dockerfile.prod` exists in backend directory
- Verify Go version compatibility

### Database Connection Fails
- Verify environment variables are set correctly
- Check `DB_SSLMODE=require` for Railway PostgreSQL
- Ensure database service is running

### App Crashes on Start
- Check **"Deployments"** → **"View Logs"**
- Verify `JWT_SECRET` is set
- Ensure all required env vars are present

---

## 📊 Monitoring

### View Logs
1. Go to your backend service
2. Click **"Deployments"** tab
3. Click on latest deployment
4. Click **"View Logs"**

### Check Metrics
1. Go to **"Metrics"** tab
2. View CPU, Memory, Network usage

---

## 🔄 Updates & Redeployment

Railway auto-deploys on every push to your GitHub repository:

1. Make changes to your code
2. Commit and push to GitHub
3. Railway automatically rebuilds and redeploys
4. Check **"Deployments"** tab for progress

---

## 💰 Cost Estimation

**Free Tier:**
- 500 hours/month execution time
- $5 credit/month
- Perfect for MVP and testing

**Paid Tier (if needed):**
- $5/month for Hobby plan
- $0.000463/GB-hour for resources
- Estimated: ~$10-15/month for small app

---

## 🎉 Next Steps

After successful deployment:

1. ✅ Note your Railway API URL
2. ✅ Update frontend `.env` with production URL
3. ✅ Test all API endpoints
4. ✅ Build and distribute mobile app

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create issue in your repo

---

**Deployment Date:** _____________  
**API URL:** _____________  
**Database:** PostgreSQL on Railway  
**Status:** 🟢 Live

