# 🌐 Permanent Deployment Guide - Ikarus Furniture Recommendation Engine

Deploy your furniture recommendation system permanently with live URLs that never expire.

## 🚀 **Option 1: Railway + Vercel (Recommended)**

### **Backend on Railway**
Railway provides excellent FastAPI support with automatic deployments.

#### **Step-by-Step:**
1. **Sign up**: Go to [railway.app](https://railway.app) → Sign up with GitHub
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose `chinmaysolanki/ikarus3d_102203389`
4. **Auto-Detection**: Railway will detect FastAPI automatically
5. **Environment Variables**:
   ```
   OPENAI_API_KEY=your_openai_key
   PINECONE_API_KEY=your_pinecone_key
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```
6. **Deploy**: Click "Deploy" - takes 2-3 minutes
7. **Get URL**: You'll get `https://ikarus-backend-production.up.railway.app`

#### **Railway Features:**
- ✅ **Free Tier**: $5 credit monthly (enough for small apps)
- ✅ **Auto-Deploy**: Updates on every GitHub push
- ✅ **Custom Domains**: Add your own domain
- ✅ **Environment Variables**: Secure key management
- ✅ **Logs**: Real-time application logs
- ✅ **Metrics**: CPU, memory, request monitoring

### **Frontend on Vercel**
Vercel provides excellent React/Vite hosting with global CDN.

#### **Step-by-Step:**
1. **Sign up**: Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Import Project**: Click "New Project" → Import `chinmaysolanki/ikarus3d_102203389`
3. **Framework Preset**: Select `Vite`
4. **Root Directory**: Set to `web`
5. **Environment Variables**:
   ```
   VITE_API_URL=https://ikarus-backend-production.up.railway.app
   ```
6. **Deploy**: Click "Deploy" - takes 1-2 minutes
7. **Get URL**: You'll get `https://ikarus3d-102203389.vercel.app`

#### **Vercel Features:**
- ✅ **Free Forever**: Unlimited personal projects
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Auto-Deploy**: Updates on every GitHub push
- ✅ **Custom Domains**: Add your own domain
- ✅ **Preview Deployments**: Test before going live
- ✅ **Analytics**: Built-in performance analytics

## 🐳 **Option 2: Render (All-in-One)**

Render can host both frontend and backend with a single account.

### **Backend on Render**
1. **Sign up**: Go to [render.com](https://render.com) → Sign up with GitHub
2. **New Web Service**: Click "New" → "Web Service"
3. **Connect Repository**: Select `chinmaysolanki/ikarus3d_102203389`
4. **Configuration**:
   ```
   Name: ikarus-backend
   Environment: Python 3
   Build Command: cd server && pip install -r requirements.txt
   Start Command: cd server && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. **Environment Variables**: Same as Railway
6. **Deploy**: Click "Create Web Service"
7. **Get URL**: `https://ikarus-backend.onrender.com`

### **Frontend on Render**
1. **New Static Site**: Click "New" → "Static Site"
2. **Connect Repository**: Same repository
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
5. **Deploy**: Click "Create Static Site"
6. **Get URL**: `https://ikarus-frontend.onrender.com`

## 🔧 **Option 3: DigitalOcean App Platform**

For more control and better performance.

### **Setup:**
1. **Sign up**: Go to [digitalocean.com](https://digitalocean.com)
2. **App Platform**: Click "Create" → "Apps"
3. **GitHub Integration**: Connect your repository
4. **Configure Services**:
   - **Backend Service**: Python service pointing to `server/`
   - **Frontend Service**: Static site pointing to `web/dist`
5. **Environment Variables**: Same as above
6. **Deploy**: Click "Create Resources"

## 📋 **Deployment Checklist**

### **Before Deployment:**
- [ ] Test locally with `./deploy.sh start`
- [ ] Ensure all dependencies are in `requirements.txt`
- [ ] Check environment variables in `env.example`
- [ ] Verify API endpoints work: `/health`, `/api/recommend`, `/api/analytics/summary`

### **After Deployment:**
- [ ] Test backend URL: `https://your-backend-url.com/health`
- [ ] Test frontend URL: `https://your-frontend-url.com`
- [ ] Verify API connection from frontend
- [ ] Check analytics dashboard loads
- [ ] Test search functionality
- [ ] Monitor logs for errors

## 🔐 **Environment Variables Reference**

### **Required for Backend:**
```bash
# Application
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000

# AI Services (Optional)
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...

# Security
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://your-frontend-url.com
```

### **Required for Frontend:**
```bash
# API Connection
VITE_API_URL=https://your-backend-url.com
```

## 🌍 **Custom Domain Setup**

### **Railway Custom Domain:**
1. Go to your Railway project
2. Click "Settings" → "Domains"
3. Add your domain: `api.yourdomain.com`
4. Update DNS records as instructed
5. Update `CORS_ORIGINS` environment variable

### **Vercel Custom Domain:**
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your domain: `yourdomain.com`
4. Update DNS records as instructed
5. Update `VITE_API_URL` environment variable

## 📊 **Monitoring Your Deployment**

### **Health Checks:**
```bash
# Backend health
curl https://your-backend-url.com/health

# Frontend accessibility
curl https://your-frontend-url.com

# API functionality
curl -X POST https://your-backend-url.com/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "modern chair", "k": 5}'
```

### **Logs Monitoring:**
- **Railway**: Real-time logs in dashboard
- **Vercel**: Function logs in dashboard
- **Render**: Application logs in dashboard

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Backend Not Starting:**
```bash
# Check logs for errors
# Common fixes:
- Verify all dependencies in requirements.txt
- Check environment variables are set
- Ensure PORT environment variable is available
```

#### **Frontend Can't Connect to Backend:**
```bash
# Check CORS settings
# Verify VITE_API_URL is correct
# Test backend URL directly
```

#### **Slow Loading:**
```bash
# Enable caching
# Use CDN (Vercel provides this automatically)
# Optimize images and assets
```

## 💰 **Cost Comparison**

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Railway** | $5/month credit | $5+/month | Full-stack apps |
| **Vercel** | Unlimited personal | $20+/month | Frontend hosting |
| **Render** | 750 hours/month | $7+/month | Simple deployments |
| **DigitalOcean** | $5/month credit | $5+/month | Production apps |

## 🎯 **Recommended Setup**

**For Students/Portfolio:**
- **Backend**: Railway (free tier)
- **Frontend**: Vercel (free forever)
- **Total Cost**: $0

**For Production:**
- **Backend**: Railway ($5/month)
- **Frontend**: Vercel ($20/month)
- **Custom Domain**: $10-15/year
- **Total Cost**: ~$35/month

## 🚀 **Quick Deploy Commands**

```bash
# Test locally first
./deploy.sh start

# Check health
./deploy.sh health

# Deploy to Railway (manual setup required)
# Deploy to Vercel (manual setup required)

# Monitor deployment
curl https://your-backend-url.com/health
curl https://your-frontend-url.com
```

---

**🎉 Your furniture recommendation engine will be live permanently!**

**Live URLs will look like:**
- **Frontend**: `https://ikarus3d-102203389.vercel.app`
- **Backend**: `https://ikarus-backend-production.up.railway.app`
- **API Docs**: `https://ikarus-backend-production.up.railway.app/api/docs`
