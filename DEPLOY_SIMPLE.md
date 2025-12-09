# 🚀 SyncUp Quick Deploy - Vercel + Render + Neon

## ⏱️ Total Time: ~25 minutes | 💰 Cost: $0 Forever

---

## OVERVIEW

| Component | Platform | Free Forever |
|-----------|----------|--------------|
| Frontend | Vercel | ✅ Yes |
| Backend | Render | ✅ Yes |
| Database | Neon PostgreSQL | ✅ Yes |

**Note:** We're using Neon PostgreSQL instead of MySQL because:
- Render doesn't have free MySQL
- Neon offers free PostgreSQL with 0.5GB storage
- Works exactly the same for our app

---

## STEP 1: DATABASE - NEON (5 mins)

### 1.1 Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Click **"Create Project"**
   - Name: `syncup-db`
   - Region: Select closest to you (or default)
4. Click **"Create Project"**

### 1.2 Get Connection String
1. On dashboard, you'll see **Connection String**
2. Click **"Copy"** next to the connection string
3. It looks like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

**Save this! You'll need it for Render.**

---

## STEP 2: BACKEND - RENDER (10 mins)

### 2.1 Push Backend to GitHub

Open terminal in your project:

```bash
cd c:\Users\Vaibhav\Desktop\Projects\AC1
```

First, create a `.gitignore` in the root if not exists:
```bash
# In the AC1 folder, make sure .gitignore has:
# backend/target/
# frontend/node_modules/
# frontend/dist/
# *.log
```

Initialize and push:
```bash
git init
git add .
git commit -m "SyncUp - Activity Matching Platform"
```

**Now go to GitHub.com:**
1. Click **"+"** → **"New repository"**
2. Name: `syncup`
3. Keep it **Public**
4. DON'T initialize with README
5. Click **"Create repository"**

Back in terminal:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/syncup.git
git branch -M main
git push -u origin main
```

### 2.2 Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Get Started"** → **"GitHub"**
3. Authorize Render to access GitHub

### 2.3 Deploy Backend on Render
1. Click **"New +"** → **"Web Service"**
2. Connect your **syncup** repository
3. Configure:
   - **Name:** `syncup-backend`
   - **Region:** Oregon (or closest)
   - **Root Directory:** `backend`
   - **Runtime:** `Java`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/app-0.0.1-SNAPSHOT.jar`
   - **Instance Type:** **Free** ✅

4. Click **"Advanced"** → **"Add Environment Variable"**:

   | Key | Value |
   |-----|-------|
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://YOUR_NEON_HOST/neondb?sslmode=require` |
   | `SPRING_DATASOURCE_USERNAME` | (from Neon connection string) |
   | `SPRING_DATASOURCE_PASSWORD` | (from Neon connection string) |
   | `JWT_SECRET` | `SyncUpSuperSecretJWTKey2024ForProductionUse!` |

   **How to get values from Neon connection string:**
   ```
   postgresql://USERNAME:PASSWORD@HOST/DATABASE
   
   Example: postgresql://vaibhav:abc123@ep-cool-sun-123.us-east-1.aws.neon.tech/neondb
   
   SPRING_DATASOURCE_URL = jdbc:postgresql://ep-cool-sun-123.us-east-1.aws.neon.tech/neondb?sslmode=require
   SPRING_DATASOURCE_USERNAME = vaibhav
   SPRING_DATASOURCE_PASSWORD = abc123
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 mins first time)
7. You'll get URL like: `https://syncup-backend.onrender.com`

### 2.4 Test Backend
Open in browser: `https://syncup-backend.onrender.com/api/activities/categories`

You should see: `["Sports","Music","Gaming",...]`

---

## STEP 3: FRONTEND - VERCEL (5 mins)

### 3.1 Update Frontend API URL

Before deploying, update the `.env` file:

**File: `frontend/.env`**
```
VITE_API_URL=https://syncup-backend.onrender.com/api
```

Push the change:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 3.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Click **"Add New Project"**
4. Import your **syncup** repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** Click **"Edit"** → type `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

6. Click **"Environment Variables"** → Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://syncup-backend.onrender.com/api`

7. Click **"Deploy"**
8. Wait 1-2 mins
9. You'll get URL like: `https://syncup.vercel.app`

---

## STEP 4: UPDATE BACKEND CORS (2 mins)

Now update Render with your Vercel URL:

1. Go to Render Dashboard → syncup-backend → Environment
2. Add new variable:
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** `https://syncup.vercel.app,https://YOUR_APP_NAME.vercel.app`
3. Click **"Save Changes"** (auto redeploys)

---

## ✅ DEPLOYMENT COMPLETE!

### Your Live URLs:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://syncup-backend.onrender.com`
- **Database:** Neon (managed automatically)

---

## ⚠️ KNOWN LIMITATIONS

| Issue | Impact | Solution |
|-------|--------|----------|
| **Cold Starts** | First request after 15 mins = 30-50 seconds | Just wait, it wakes up |
| **Neon sleep** | DB sleeps after 5 mins inactivity | Auto-wakes on request |
| **First load slow** | Both services sleeping | Normal, subsequent loads fast |

---

## 🎤 What to Tell Interviewer

> "I deployed SyncUp using a modern serverless architecture:
> - **Frontend** on Vercel with global CDN for instant loading
> - **Backend** Spring Boot on Render with auto-scaling
> - **Database** on Neon's serverless PostgreSQL
> 
> This architecture demonstrates understanding of cloud deployment, CI/CD (auto-deploys on git push), and cost-effective infrastructure choices."

---

## 🔄 Future Updates

Any time you push to GitHub:
- Vercel auto-deploys frontend in ~1 min
- Render auto-deploys backend in ~5 mins

No manual deployment needed!

---

## 🆘 Troubleshooting

### Backend not working?
1. Check Render logs: Dashboard → syncup-backend → Logs
2. Common issues:
   - Wrong database URL format
   - Missing environment variables

### Frontend API errors?
1. Check browser console (F12 → Console)
2. Verify VITE_API_URL is correct
3. Check CORS settings on Render

### Database connection failed?
1. Verify Neon project is active
2. Check username/password in Render env vars
3. Make sure `?sslmode=require` is in URL

---

## 📞 Need Help?

Let me know if you hit any issues! I'll help you debug.
