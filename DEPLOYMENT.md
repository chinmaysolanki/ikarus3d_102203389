# 🚀 AI Furniture Recommendations - Deployment Guide

This guide covers multiple deployment options for your AI Furniture Recommendations application.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Git (for version control)
- Cloud provider account (for cloud deployment)

## 🏠 Local Deployment (Docker)

### Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ai-furniture-recommendations

# 2. Deploy locally
./deploy.sh deploy

# 3. Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Docker Commands

```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

## ☁️ Cloud Deployment Options

### 1. AWS ECS/Fargate

#### Prerequisites
- AWS CLI configured
- ECR repository created

#### Steps
```bash
# 1. Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag images
docker build -t ai-furniture-backend ./server
docker build -t ai-furniture-frontend ./web

# Tag for ECR
docker tag ai-furniture-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/ai-furniture-backend:latest
docker tag ai-furniture-frontend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/ai-furniture-frontend:latest

# Push to ECR
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/ai-furniture-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/ai-furniture-frontend:latest

# 2. Create ECS task definitions and services
# (Use AWS Console or CloudFormation)
```

### 2. Google Cloud Run

#### Prerequisites
- Google Cloud SDK installed
- Project created

#### Steps
```bash
# 1. Configure gcloud
gcloud config set project <your-project-id>

# 2. Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# 3. Deploy backend
cd server
gcloud run deploy ai-furniture-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000

# 4. Deploy frontend
cd ../web
gcloud run deploy ai-furniture-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

### 3. Azure Container Instances

#### Prerequisites
- Azure CLI installed
- Resource group created

#### Steps
```bash
# 1. Login to Azure
az login

# 2. Create container registry
az acr create --resource-group <resource-group> --name <registry-name> --sku Basic

# 3. Build and push images
az acr build --registry <registry-name> --image ai-furniture-backend ./server
az acr build --registry <registry-name> --image ai-furniture-frontend ./web

# 4. Deploy containers
az container create \
  --resource-group <resource-group> \
  --name ai-furniture-backend \
  --image <registry-name>.azurecr.io/ai-furniture-backend:latest \
  --ports 8000 \
  --environment-variables DEBUG=false

az container create \
  --resource-group <resource-group> \
  --name ai-furniture-frontend \
  --image <registry-name>.azurecr.io/ai-furniture-frontend:latest \
  --ports 80
```

### 4. DigitalOcean App Platform

#### Steps
1. Create a new app in DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure build settings:
   - **Backend**: Build command: `pip install -r requirements.txt`, Run command: `uvicorn main:app --host 0.0.0.0 --port 8080`
   - **Frontend**: Build command: `npm run build`, Run command: `npm run preview`
4. Set environment variables
5. Deploy

### 5. Heroku

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Steps
```bash
# 1. Create Heroku apps
heroku create ai-furniture-backend
heroku create ai-furniture-frontend

# 2. Deploy backend
cd server
heroku git:remote -a ai-furniture-backend
git subtree push --prefix=server heroku main

# 3. Deploy frontend
cd ../web
heroku git:remote -a ai-furniture-frontend
git subtree push --prefix=web heroku main
```

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env` file with the following variables:

```bash
# Application Settings
DEBUG=false
LOG_LEVEL=info

# API Keys (Optional)
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment

# Security
SECRET_KEY=your_secret_key_here

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📊 Monitoring and Logging

### Health Checks

The application includes health check endpoints:
- Backend: `GET /health`
- Frontend: `GET /health` (proxied to backend)

### Logging

Logs are available in:
- Docker: `docker-compose logs -f`
- Cloud platforms: Use their respective logging services

### Performance Monitoring

Consider adding:
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Metrics collection (Prometheus/Grafana)

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change default secret keys
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable container security scanning
- [ ] Use secrets management for API keys
- [ ] Regular security updates

### SSL/TLS Setup

For production, always use HTTPS:

```bash
# Using Let's Encrypt with Certbot
certbot --nginx -d yourdomain.com

# Or use cloud provider SSL certificates
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Memory issues**: Increase Docker memory limits
3. **Build failures**: Check Dockerfile syntax and dependencies
4. **API connection issues**: Verify CORS and network settings

### Debug Commands

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Check resource usage
docker stats
```

## 📈 Scaling

### Horizontal Scaling

- Use load balancers (nginx, HAProxy)
- Deploy multiple backend instances
- Use managed databases (RDS, Cloud SQL)
- Implement caching (Redis, Memcached)

### Vertical Scaling

- Increase container resources
- Use more powerful cloud instances
- Optimize application performance

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to cloud
        run: |
          # Your deployment commands here
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test locally with Docker
4. Check cloud provider documentation

## 🎯 Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure automated backups
3. Implement CI/CD pipeline
4. Plan for scaling and optimization
5. Regular security updates and maintenance
