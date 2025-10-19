# 🆓 FREE Deployment Guide - No Limits!

Deploy your **Ikarus Furniture Recommendation Engine** on completely free platforms with no usage restrictions.

## 🎯 **Recommended: Render (100% Free)**

### **Why Render?**
- ✅ **Free Forever**: No time limits, no credit card required
- ✅ **750 Hours/Month**: More than enough for personal projects
- ✅ **Auto-Deploy**: Updates on every GitHub push
- ✅ **Custom Domains**: Add your own domain for free
- ✅ **Both Services**: Host backend + frontend in one place

### **Step-by-Step Deployment:**

#### **1. Sign Up**
- Go to [render.com](https://render.com)
- Click "Get Started for Free"
- Sign up with GitHub (no credit card needed)

#### **2. Deploy Backend**
1. Click "New" → "Web Service"
2. Connect GitHub → Select `chinmaysolanki/ikarus3d_102203389`
3. **Configuration**:
   ```
   Name: ikarus-backend
   Environment: Python 3
   Build Command: cd server && pip install -r requirements.txt
   Start Command: cd server && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. **Environment Variables** (Optional):
   ```
   ENVIRONMENT=production
   OPENAI_API_KEY=your_key (if you have one)
   ```
5. Click "Create Web Service"
6. **Wait 2-3 minutes** → Get URL: `https://ikarus-backend.onrender.com`

#### **3. Deploy Frontend**
1. Click "New" → "Static Site"
2. Connect GitHub → Same repository
3. **Configuration**:
   ```
   Name: ikarus-frontend
   Build Command: cd web && npm install && npm run build
   Publish Directory: web/dist
   ```
4. **Environment Variables**:
   ```
   VITE_API_URL=https://ikarus-backend.onrender.com
   ```
5. Click "Create Static Site"
6. **Wait 1-2 minutes** → Get URL: `https://ikarus-frontend.onrender.com`

#### **4. Update Backend CORS**
1. Go to your backend service on Render
2. Click "Environment" tab
3. Add environment variable:
   ```
   CORS_ORIGINS=https://ikarus-frontend.onrender.com
   ```
4. Click "Save Changes" → Service will restart automatically

---

## 🚀 **Alternative: Fly.io (Free Tier)**

### **Why Fly.io?**
- ✅ **3 Free Apps**: No time limits
- ✅ **256MB RAM**: Enough for your app
- ✅ **Global CDN**: Fast worldwide
- ✅ **Custom Domains**: Free subdomains

### **Deployment Steps:**

#### **1. Install Fly CLI**
```bash
# macOS
brew install flyctl

# Or download from: https://fly.io/docs/hands-on/install-flyctl/
```

#### **2. Sign Up & Login**
```bash
fly auth signup
fly auth login
```

#### **3. Deploy Backend**
```bash
# From your project root
cd server
fly launch --no-deploy

# Edit fly.toml if needed, then deploy
fly deploy
```

#### **4. Deploy Frontend to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. "New site from Git" → Select repository
4. **Build settings**:
   ```
   Build command: cd web && npm install && npm run build
   Publish directory: web/dist
   ```
5. **Environment variables**:
   ```
   VITE_API_URL=https://your-app-name.fly.dev
   ```

---

## 🌐 **Alternative: Netlify + Supabase**

### **Why This Combo?**
- ✅ **Netlify**: Free frontend hosting forever
- ✅ **Supabase**: Free PostgreSQL database
- ✅ **Edge Functions**: Serverless backend
- ✅ **No Limits**: Truly unlimited usage

### **Setup Steps:**

#### **1. Supabase Backend**
1. Go to [supabase.com](https://supabase.com)
2. Sign up → Create new project
3. Go to "Edge Functions" → Create new function
4. Upload your FastAPI code as Edge Function
5. Get URL: `https://your-project.supabase.co/functions/v1/your-function`

#### **2. Netlify Frontend**
1. Deploy to Netlify (same as above)
2. Set environment variable:
   ```
   VITE_API_URL=https://your-project.supabase.co/functions/v1/your-function
   ```

---

## 📋 **Quick Start Commands**

### **For Render:**
```bash
# 1. Push your code to GitHub
git add .
git commit -m "Add deployment configs"
git push origin main

# 2. Go to render.com and deploy (manual steps above)

# 3. Test your deployment
curl https://ikarus-backend.onrender.com/health
curl https://ikarus-frontend.onrender.com
```

### **For Fly.io:**
```bash
# 1. Install flyctl
brew install flyctl

# 2. Login and deploy
fly auth login
cd server && fly launch
fly deploy

# 3. Get your URL
fly info
```

---

## 🔧 **Environment Variables Reference**

### **Backend (All Platforms):**
```bash
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000  # Or $PORT for cloud platforms

# Optional AI services
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...

# CORS (update with your frontend URL)
CORS_ORIGINS=https://ikarus-frontend.onrender.com
```

### **Frontend (All Platforms):**
```bash
# Update this with your backend URL
VITE_API_URL=https://ikarus-backend.onrender.com
```

---

## 🎯 **Platform Comparison**

| Platform | Free Tier | Limits | Best For |
|----------|-----------|--------|----------|
| **Render** | 750 hrs/month | Sleeps after 15min | Full-stack apps |
| **Fly.io** | 3 apps, 256MB | No time limits | Always-on apps |
| **Netlify** | Unlimited sites | 100GB bandwidth | Frontend hosting |
| **Supabase** | 500MB DB | 2GB bandwidth | Backend + DB |

---

## 🚨 **Troubleshooting**

### **Render Issues:**
```bash
# Check logs
# Go to your service → Logs tab

# Common fixes:
- Ensure requirements.txt has all dependencies
- Check build command is correct
- Verify environment variables
```

### **Fly.io Issues:**
```bash
# Check logs
fly logs

# Restart app
fly restart

# Check status
fly status
```

### **Netlify Issues:**
```bash
# Check build logs in dashboard
# Common fixes:
- Ensure build command is correct
- Check Node.js version compatibility
- Verify environment variables
```

---

## 🎉 **Your Live URLs Will Be:**

**Render:**
- Frontend: `https://ikarus-frontend.onrender.com`
- Backend: `https://ikarus-backend.onrender.com`
- API Docs: `https://ikarus-backend.onrender.com/api/docs`

**Fly.io:**
- Backend: `https://ikarus-furniture.fly.dev`
- Frontend: `https://ikarus-frontend.netlify.app`

---

## 💡 **Pro Tips:**

1. **Start with Render** - easiest setup
2. **Use custom domains** for professional look
3. **Monitor logs** for debugging
4. **Set up auto-deploy** from GitHub
5. **Test health endpoints** regularly

---

**🚀 Ready to deploy? Choose Render for the easiest setup!**
