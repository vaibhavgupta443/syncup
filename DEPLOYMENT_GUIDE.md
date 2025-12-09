# 🚀 SyncUp Deployment Guide - Hybrid (Vercel + AWS)

## 💰 ZERO COST GUARANTEE

This guide ensures you stay **100% within free tier limits**.

---

## 🛡️ STEP 0: AWS BILLING SAFETY (DO THIS FIRST!)

### After creating AWS account:

1. **Go to AWS Console → Billing → Budgets**
2. Click **"Create Budget"**
3. Select **"Zero spend budget"**
4. Set alert to email you at **$0.01** (yes, 1 cent!)
5. **This will alert you BEFORE any charge**

### Also set up:
1. **Billing → Preferences → Receive Free Tier Usage Alerts** ✅
2. **Billing → Preferences → Receive Billing Alerts** ✅

---

## 📋 What We're Using (All FREE)

| Component | Service | Free Tier Limit |
|-----------|---------|-----------------|
| Frontend | Vercel | 100GB bandwidth/month |
| Backend | AWS EC2 t2.micro | 750 hrs/month (runs 24/7 free) |
| Database | AWS RDS MySQL | 750 hrs/month + 20GB storage |
| Domain | Vercel subdomain | Forever free |

---

## PART 1: VERCEL FRONTEND (10 mins)

### Step 1.1: Create GitHub Repository for Frontend

```bash
cd c:\Users\Vaibhav\Desktop\Projects\AC1\frontend

# Initialize git if not already
git init
git add .
git commit -m "SyncUp frontend ready for deployment"

# Create repo on github.com/new called "syncup-frontend"
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/syncup-frontend.git
git branch -M main
git push -u origin main
```

### Step 1.2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Click **"Add New Project"**
4. Select **"syncup-frontend"** repo
5. Framework: **Vite** (auto-detected)
6. **IMPORTANT:** Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `http://YOUR_EC2_IP:8080/api` (we'll update this later)
7. Click **"Deploy"**

✅ **Frontend done!** You'll get a URL like: `https://syncup-frontend.vercel.app`

---

## PART 2: AWS SETUP (30 mins)

### Step 2.1: Create AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click **"Create an AWS Account"**
3. Enter email, password
4. **Account type: Personal**
5. Enter credit card (required but WON'T be charged if you follow this guide)
6. Complete phone verification
7. Select **"Basic Support - Free"**

### ⚠️ Step 2.2: SET UP BILLING ALERTS IMMEDIATELY!

```
AWS Console → Search "Budgets" → Create Budget
→ "Zero spend budget" → Enter your email → Create
```

**DO NOT SKIP THIS STEP!**

---

### Step 2.3: Create RDS MySQL Database

1. AWS Console → Search **"RDS"** → Click **"Create database"**

2. **Settings:**
   - Engine: **MySQL**
   - Templates: **✅ Free tier** (IMPORTANT!)
   - DB instance identifier: `syncup-db`
   - Master username: `admin`
   - Master password: `YourSecurePassword123!` (save this!)
   
3. **Instance configuration:**
   - DB instance class: **db.t3.micro** (Free tier eligible)
   
4. **Storage:**
   - Allocated storage: **20 GB** (Free tier max)
   - ❌ Disable storage autoscaling (IMPORTANT - prevents charges!)
   
5. **Connectivity:**
   - Public access: **Yes** (needed for EC2 connection)
   - VPC security group: **Create new**
   - Security group name: `syncup-db-sg`
   
6. **Additional configuration:**
   - Initial database name: `syncup_db`
   - ❌ Disable automated backups (saves storage costs)
   - ❌ Disable Performance Insights
   - ❌ Disable Enhanced monitoring
   
7. Click **"Create database"** (takes 5-10 mins)

8. **After creation:**
   - Click on database → Note the **Endpoint** (like: `syncup-db.xxx.us-east-1.rds.amazonaws.com`)
   - Click on Security Group → Edit Inbound Rules
   - Add rule: Type: **MySQL/Aurora**, Source: **Anywhere-IPv4**

---

### Step 2.4: Create EC2 Instance

1. AWS Console → Search **"EC2"** → Click **"Launch Instance"**

2. **Settings:**
   - Name: `syncup-backend`
   - AMI: **Amazon Linux 2023** (Free tier eligible)
   - Instance type: **t2.micro** ✅ (Free tier eligible)
   - Key pair: **Create new key pair**
     - Name: `syncup-key`
     - Type: RSA
     - Format: `.pem`
     - **Download and save this file safely!**
   
3. **Network settings → Edit:**
   - Auto-assign Public IP: **Enable**
   - Security group: **Create new**
   - Security group name: `syncup-backend-sg`
   - Add rules:
     - SSH (22) - Source: My IP
     - HTTP (80) - Source: Anywhere
     - Custom TCP (8080) - Source: Anywhere
     - Custom TCP (5173) - Source: Anywhere
   
4. **Configure storage:**
   - 8 GB gp3 (Free tier allows up to 30GB)
   
5. Click **"Launch instance"**

6. **Note your Public IPv4 address** (like: `54.123.45.67`)

---

### Step 2.5: Connect to EC2 and Install Dependencies

**On Windows (PowerShell):**
```powershell
# Move your key file to a safe location
Move-Item Downloads\syncup-key.pem C:\Users\Vaibhav\.ssh\

# Connect to EC2
ssh -i C:\Users\Vaibhav\.ssh\syncup-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

**On EC2 (after connecting):**
```bash
# Update system
sudo yum update -y

# Install Java 17
sudo yum install java-17-amazon-corretto -y

# Verify
java -version

# Install Git
sudo yum install git -y
```

---

### Step 2.6: Deploy Backend to EC2

**On your local machine, build the JAR:**
```bash
cd c:\Users\Vaibhav\Desktop\Projects\AC1\backend

# Update application.properties with RDS endpoint
# (I'll create this file for you)

# Build the JAR
mvnw clean package -DskipTests
```

**Upload JAR to EC2:**
```powershell
scp -i C:\Users\Vaibhav\.ssh\syncup-key.pem target\app-0.0.1-SNAPSHOT.jar ec2-user@YOUR_EC2_IP:~/
```

**On EC2, run the backend:**
```bash
# Create a startup script
cat > start.sh << 'EOF'
#!/bin/bash
nohup java -jar app-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
echo "Backend started! Check app.log for logs"
EOF

chmod +x start.sh
./start.sh

# Check if running
curl http://localhost:8080/api/activities/categories
```

---

### Step 2.7: Update Vercel with EC2 IP

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to: `http://YOUR_EC2_PUBLIC_IP:8080/api`
3. Redeploy (Deployments → ... → Redeploy)

---

## ✅ DEPLOYMENT COMPLETE!

Your app is now live at:
- **Frontend:** `https://syncup-frontend.vercel.app`
- **Backend:** `http://YOUR_EC2_IP:8080`

---

## 🛡️ STAYING FREE - CHECKLIST

### Weekly Check (takes 2 mins):
1. AWS Console → Billing Dashboard
2. Verify: **$0.00** charges

### Free Tier Limits to Watch:
| Resource | Limit | Your Usage |
|----------|-------|------------|
| EC2 | 750 hrs/month | ~720 hrs (24/7) ✅ |
| RDS | 750 hrs/month | ~720 hrs (24/7) ✅ |
| RDS Storage | 20 GB | ~100 MB ✅ |
| Data Transfer | 15 GB/month | ~1-2 GB ✅ |

### ⚠️ Things That WILL Cost Money (AVOID):
- ❌ Creating more than 1 EC2 instance
- ❌ Creating more than 1 RDS instance
- ❌ Using instance types other than t2.micro/t3.micro
- ❌ Enabling RDS storage autoscaling
- ❌ Enabling Multi-AZ deployment
- ❌ Running instances after 12 months

---

## 🚨 EMERGENCY: If You See Charges

1. **Stop all EC2 instances** (don't terminate, just stop)
2. **Stop RDS database**
3. Go to AWS Support → Create case
4. Explain you're a student on free tier
5. AWS usually refunds small accidental charges!

---

## 📅 12-Month Reminder

Set a calendar reminder for **11 months from today**:
- "AWS Free Tier expires next month - migrate to Render/Railway or delete resources"

---

## Need Help?

If anything goes wrong, message me and I'll help you fix it! 🛠️
