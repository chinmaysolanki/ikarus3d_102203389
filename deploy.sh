#!/bin/bash

# 🚀 Ikarus Furniture Recommendation Engine - Quick Deployment Script
# This script automates the deployment process for different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ikarus-furniture-engine"
BACKEND_PORT=8000
FRONTEND_PORT=3001

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_requirements() {
    print_header "Checking Requirements"
    
    # Check Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION found"
    else
        print_error "Python 3 is required but not installed"
        exit 1
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION found"
    else
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker $DOCKER_VERSION found"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker not found - will use local deployment"
        DOCKER_AVAILABLE=false
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        print_success "Git found"
    else
        print_error "Git is required but not installed"
        exit 1
    fi
}

setup_backend() {
    print_header "Setting Up Backend"
    
    cd server
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "../venv" ]; then
        print_success "Creating virtual environment"
        python3 -m venv ../venv
    fi
    
    # Activate virtual environment
    source ../venv/bin/activate
    
    # Install dependencies
    print_success "Installing Python dependencies"
    pip install -r requirements.txt
    
    # Copy environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_success "Creating environment file"
        cp ../env.example .env
        print_warning "Please edit server/.env with your API keys"
    fi
    
    cd ..
}

setup_frontend() {
    print_header "Setting Up Frontend"
    
    cd web
    
    # Install dependencies
    print_success "Installing Node.js dependencies"
    npm install
    
    cd ..
}

start_services_local() {
    print_header "Starting Services (Local)"
    
    # Start backend in background
    print_success "Starting backend server"
    cd server
    source ../venv/bin/activate
    python -m uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    print_success "Starting frontend server"
    cd web
    npm run dev -- --port $FRONTEND_PORT &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend to start
    sleep 5
    
    print_success "Services started successfully!"
    echo -e "${GREEN}Backend: http://localhost:$BACKEND_PORT${NC}"
    echo -e "${GREEN}Frontend: http://localhost:$FRONTEND_PORT${NC}"
    echo -e "${GREEN}API Docs: http://localhost:$BACKEND_PORT/api/docs${NC}"
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
}

start_services_docker() {
    print_header "Starting Services (Docker)"
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        print_success "Starting services with Docker Compose"
        docker-compose up --build -d
        
        # Wait for services to start
        sleep 10
        
        print_success "Services started successfully!"
        echo -e "${GREEN}Backend: http://localhost:$BACKEND_PORT${NC}"
        echo -e "${GREEN}Frontend: http://localhost:$FRONTEND_PORT${NC}"
        echo -e "${GREEN}API Docs: http://localhost:$BACKEND_PORT/api/docs${NC}"
    else
        print_error "Docker not available, falling back to local deployment"
        start_services_local
    fi
}

stop_services() {
    print_header "Stopping Services"
    
    # Stop local services
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        if ps -p $BACKEND_PID > /dev/null; then
            kill $BACKEND_PID
            print_success "Backend stopped"
        fi
        rm .backend.pid
    fi
    
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend stopped"
        fi
        rm .frontend.pid
    fi
    
    # Stop Docker services
    if [ "$DOCKER_AVAILABLE" = true ]; then
        docker-compose down
        print_success "Docker services stopped"
    fi
}

deploy_production() {
    print_header "Production Deployment"
    
    print_warning "Production deployment requires additional configuration"
    echo "Please ensure you have:"
    echo "1. Production environment variables configured"
    echo "2. SSL certificates ready"
    echo "3. Domain name configured"
    echo "4. Database setup (if using external DB)"
    
    read -p "Continue with production deployment? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$DOCKER_AVAILABLE" = true ]; then
            docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
            print_success "Production deployment started"
        else
            print_error "Docker is required for production deployment"
            exit 1
        fi
    else
        print_warning "Production deployment cancelled"
    fi
}

health_check() {
    print_header "Health Check"
    
    # Check backend
    if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
        print_success "Backend is healthy"
    else
        print_error "Backend is not responding"
    fi
    
    # Check frontend
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend is not responding"
    fi
}

cleanup() {
    print_header "Cleanup"
    
    # Stop services
    stop_services
    
    # Clean up temporary files
    rm -f .backend.pid .frontend.pid
    
    # Clean up Docker (optional)
    if [ "$DOCKER_AVAILABLE" = true ]; then
        read -p "Remove Docker images and containers? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down --rmi all --volumes --remove-orphans
            print_success "Docker cleanup completed"
        fi
    fi
}

show_help() {
    echo "Ikarus Furniture Recommendation Engine - Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Set up the project (install dependencies)"
    echo "  start     - Start the services"
    echo "  stop      - Stop the services"
    echo "  restart   - Restart the services"
    echo "  health    - Check service health"
    echo "  deploy    - Deploy to production"
    echo "  cleanup   - Clean up everything"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup    # Set up the project"
    echo "  $0 start    # Start services locally"
    echo "  $0 deploy   # Deploy to production"
}

# Main script logic
case "${1:-start}" in
    "setup")
        check_requirements
        setup_backend
        setup_frontend
        print_success "Setup completed! Run '$0 start' to start the services"
        ;;
    "start")
        check_requirements
        if [ "$DOCKER_AVAILABLE" = true ] && [ -f "docker-compose.yml" ]; then
            start_services_docker
        else
            start_services_local
        fi
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        if [ "$DOCKER_AVAILABLE" = true ] && [ -f "docker-compose.yml" ]; then
            start_services_docker
        else
            start_services_local
        fi
        ;;
    "health")
        health_check
        ;;
    "deploy")
        deploy_production
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

print_success "Deployment script completed!"