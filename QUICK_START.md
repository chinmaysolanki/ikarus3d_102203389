# 🚀 Quick Start Guide - Ikarus Furniture Recommendation Engine

Get your furniture recommendation system up and running in minutes!

## ⚡ Super Quick Start (5 minutes)

### Option 1: Using the Deployment Script (Recommended)
```bash
# Clone the repository
git clone https://github.com/chinmaysolanki/ikarus3d_102203389.git
cd ikarus3d_102203389

# Make deployment script executable
chmod +x deploy.sh

# Set up everything automatically
./deploy.sh setup

# Start the services
./deploy.sh start
```

### Option 2: Manual Setup
```bash
# 1. Set up backend
cd server
python -m venv ../venv
source ../venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# 2. Set up frontend
cd ../web
npm install
npm run dev -- --port 3001 &
```

## 🌐 Access Your Application

Once started, you can access:

- **🎨 Frontend**: http://localhost:3001
- **🔧 Backend API**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/api/docs
- **❤️ Health Check**: http://localhost:8000/health

## 🐳 Docker Quick Start

If you have Docker installed:

```bash
# Start everything with Docker
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

## 🛠️ Available Commands

The deployment script provides several useful commands:

```bash
./deploy.sh setup     # Install dependencies and set up project
./deploy.sh start     # Start all services
./deploy.sh stop      # Stop all services
./deploy.sh restart   # Restart all services
./deploy.sh health    # Check if services are running
./deploy.sh deploy    # Deploy to production
./deploy.sh cleanup   # Clean up everything
./deploy.sh help      # Show help
```

## 🔧 Configuration

### Environment Variables
Copy the example environment file and customize:
```bash
cp env.example .env
# Edit .env with your API keys and settings
```

### Key Settings
- **OpenAI API Key**: For enhanced AI features (optional)
- **Pinecone API Key**: For vector database (optional, falls back to FAISS)
- **CORS Origins**: Configure allowed domains for production

## 📊 Features Available

Your deployed system includes:

✅ **Smart Search**: Vector-based furniture recommendations  
✅ **Analytics Dashboard**: Interactive charts and insights  
✅ **Real-time Data**: 215+ furniture products loaded  
✅ **Modern UI**: Responsive design with animations  
✅ **API Documentation**: Interactive Swagger UI  
✅ **Health Monitoring**: Service status checks  

## 🚨 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes using ports 8000 or 3001
lsof -ti:8000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Permission denied:**
```bash
# Make script executable
chmod +x deploy.sh
```

**Dependencies not found:**
```bash
# Reinstall dependencies
./deploy.sh cleanup
./deploy.sh setup
```

**Services not starting:**
```bash
# Check logs
./deploy.sh health
# Or manually check
curl http://localhost:8000/health
curl http://localhost:3001
```

## 🎯 Next Steps

1. **Explore the API**: Visit http://localhost:8000/api/docs
2. **Try the Search**: Use the frontend to search for furniture
3. **View Analytics**: Check the analytics dashboard
4. **Customize**: Modify the code to fit your needs
5. **Deploy**: Use `./deploy.sh deploy` for production

## 📚 More Information

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Architecture**: See `ARCHITECTURE.md`
- **API Reference**: Visit `/api/docs` when running

## 🆘 Need Help?

- Check the logs: `docker-compose logs -f`
- Review the troubleshooting section in `DEPLOYMENT_GUIDE.md`
- Create an issue on GitHub
- Check the health status: `./deploy.sh health`

---

**🎉 You're all set! Your furniture recommendation engine is now running!**
