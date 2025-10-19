# 🚀 Ikarus Furniture Recommendation Engine - Deployment Guide

This comprehensive guide covers multiple deployment strategies for the Ikarus Furniture Recommendation Engine, from local development to production cloud deployment.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Production Configuration](#production-configuration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements
- **Python 3.9+** (recommended: Python 3.11)
- **Node.js 18+** (recommended: Node.js 20)
- **Docker & Docker Compose** (for containerized deployment)
- **Git** (for version control)
- **8GB+ RAM** (for ML models)
- **10GB+ Storage** (for models and data)

### Required Accounts
- **GitHub** (for code repository)
- **OpenAI API** (optional, for enhanced AI features)
- **Pinecone** (optional, for vector database)
- **Cloud Provider** (AWS/GCP/Azure for production)

## 🏠 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/chinmaysolanki/ikarus3d_102203389.git
cd ikarus3d_102203389
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd server
pip install -r requirements.txt

# Set up environment variables
cp ../env.example .env
# Edit .env with your configuration

# Run backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
# Install dependencies
cd web
npm install

# Run frontend
npm run dev -- --port 3001
```

### 4. Access Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs

## 🐳 Docker Deployment

### 1. Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Individual Container Deployment

#### Backend Container
```bash
# Build backend image
cd server
docker build -t ikarus-backend .

# Run backend container
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=your_key \
  -e PINECONE_API_KEY=your_key \
  ikarus-backend
```

#### Frontend Container
```bash
# Build frontend image
cd web
docker build -t ikarus-frontend .

# Run frontend container
docker run -p 3001:80 ikarus-frontend
```

### 3. Docker Environment Configuration

Create `docker-compose.override.yml` for custom settings:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - ENVIRONMENT=production
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
  
  frontend:
    environment:
      - VITE_API_URL=http://localhost:8000
```

## ☁️ Cloud Deployment

### 1. AWS Deployment

#### Using AWS App Runner
```bash
# Create apprunner.yaml
cat > apprunner.yaml << EOF
version: 1.0
runtime: python3
build:
  commands:
    build:
      - pip install -r server/requirements.txt
run:
  runtime-version: 3.11.0
  command: cd server && python -m uvicorn main:app --host 0.0.0.0 --port 8000
  network:
    port: 8000
    env: PORT
  env:
    - name: OPENAI_API_KEY
      value: "your_openai_key"
EOF

# Deploy to App Runner
aws apprunner create-service \
  --service-name ikarus-backend \
  --source-configuration file://apprunner.yaml
```

#### Using AWS ECS with Fargate
```bash
# Create ECS task definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json

# Create ECS service
aws ecs create-service \
  --cluster ikarus-cluster \
  --service-name ikarus-service \
  --task-definition ikarus-task \
  --desired-count 2
```

### 2. Google Cloud Platform (GCP)

#### Using Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/ikarus-backend ./server
gcloud builds submit --tag gcr.io/PROJECT_ID/ikarus-frontend ./web

# Deploy to Cloud Run
gcloud run deploy ikarus-backend \
  --image gcr.io/PROJECT_ID/ikarus-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy ikarus-frontend \
  --image gcr.io/PROJECT_ID/ikarus-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 3. Azure Deployment

#### Using Azure Container Instances
```bash
# Create resource group
az group create --name ikarus-rg --location eastus

# Deploy backend
az container create \
  --resource-group ikarus-rg \
  --name ikarus-backend \
  --image ikarus-backend:latest \
  --dns-name-label ikarus-backend \
  --ports 8000 \
  --environment-variables OPENAI_API_KEY=your_key

# Deploy frontend
az container create \
  --resource-group ikarus-rg \
  --name ikarus-frontend \
  --image ikarus-frontend:latest \
  --dns-name-label ikarus-frontend \
  --ports 80
```

## ⚙️ Production Configuration

### 1. Environment Variables

Create production `.env` file:

```bash
# API Configuration
APP_NAME=IkarusFurnitureEngine
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000

# Database Configuration
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment
PINECONE_INDEX_NAME=furniture-index

# AI Configuration
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_hf_key

# Security
SECRET_KEY=your_secret_key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=INFO
```

### 2. Production Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./web
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.yourdomain.com
    restart: unless-stopped
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    restart: unless-stopped
    depends_on:
      - frontend
      - backend
```

### 3. SSL Configuration

Create SSL certificates and configure Nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring & Maintenance

### 1. Health Monitoring

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3001

# Monitor logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 2. Performance Monitoring

Add monitoring with Prometheus and Grafana:

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### 3. Backup Strategy

```bash
# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Backup database (if using external DB)
pg_dump furniture_db > backup-$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf /backups/ikarus-$DATE.tar.gz data/ logs/
aws s3 cp /backups/ikarus-$DATE.tar.gz s3://your-backup-bucket/
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :8000
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different ports
python -m uvicorn main:app --port 8001
npm run dev -- --port 3002
```

#### 2. Memory Issues
```bash
# Increase Docker memory limit
docker run --memory=4g ikarus-backend

# Monitor memory usage
docker stats
```

#### 3. Model Loading Issues
```bash
# Clear model cache
rm -rf ~/.cache/huggingface/
rm -rf ~/.cache/torch/

# Reinstall models
pip install --force-reinstall sentence-transformers
```

#### 4. CORS Issues
```bash
# Update CORS settings in main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Performance Optimization

#### 1. Model Optimization
```python
# Use smaller models for production
MODEL_CONFIG = {
    "text_encoder": "sentence-transformers/all-MiniLM-L6-v2",
    "reranker": "cross-encoder/ms-marco-MiniLM-L-6-v2",
    "generator": "distilgpt2"
}
```

#### 2. Caching Strategy
```python
# Implement Redis caching
import redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Cache embeddings
def get_cached_embedding(text):
    cache_key = f"embedding:{hash(text)}"
    cached = redis_client.get(cache_key)
    if cached:
        return pickle.loads(cached)
    return None
```

#### 3. Database Optimization
```python
# Use connection pooling
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30
)
```

## 🚀 Quick Start Commands

### Development
```bash
# Start everything locally
make dev-backend & make dev-frontend

# Or with Docker
docker-compose up --build
```

### Production
```bash
# Deploy with Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Deploy to cloud
./deploy.sh production
```

### Maintenance
```bash
# Update dependencies
make update-deps

# Run tests
make test

# Clean up
make clean
```

## 📞 Support

For deployment issues or questions:

1. **Check the logs**: `docker-compose logs -f`
2. **Review this guide**: Common issues are covered above
3. **GitHub Issues**: Create an issue in the repository
4. **Documentation**: Check README.md for additional details

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** with Prometheus/Grafana
2. **Configure backups** for data and models
3. **Set up CI/CD** with GitHub Actions
4. **Implement security** measures (SSL, authentication)
5. **Scale horizontally** as traffic grows

---

**Happy Deploying! 🚀**

*This guide covers the most common deployment scenarios. For specific cloud provider details, refer to their official documentation.*
