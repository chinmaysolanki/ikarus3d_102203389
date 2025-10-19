#!/bin/bash

# AI Furniture Recommendations - Deployment Script
# This script helps deploy the application to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Function to build and start services
deploy_local() {
    print_status "Deploying locally with Docker Compose..."
    
    # Create necessary directories
    mkdir -p data logs
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.production .env
        print_warning "Please edit .env file with your actual configuration values."
    fi
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "Application deployed locally!"
    print_status "Backend: http://localhost:8000"
    print_status "Frontend: http://localhost"
    print_status "API Docs: http://localhost:8000/docs"
}

# Function to stop services
stop_local() {
    print_status "Stopping local services..."
    docker-compose down
    print_success "Services stopped!"
}

# Function to view logs
view_logs() {
    print_status "Viewing logs..."
    docker-compose logs -f
}

# Function to restart services
restart_local() {
    print_status "Restarting services..."
    docker-compose restart
    print_success "Services restarted!"
}

# Function to update services
update_local() {
    print_status "Updating services..."
    docker-compose pull
    docker-compose up --build -d
    print_success "Services updated!"
}

# Function to show status
show_status() {
    print_status "Service status:"
    docker-compose ps
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed!"
}

# Function to deploy to cloud (placeholder)
deploy_cloud() {
    print_status "Cloud deployment options:"
    echo "1. AWS ECS/Fargate"
    echo "2. Google Cloud Run"
    echo "3. Azure Container Instances"
    echo "4. DigitalOcean App Platform"
    echo "5. Heroku"
    echo ""
    print_warning "Cloud deployment scripts are not implemented yet."
    print_warning "Please refer to the DEPLOYMENT.md file for manual deployment instructions."
}

# Function to show help
show_help() {
    echo "AI Furniture Recommendations - Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy      Deploy the application locally"
    echo "  stop        Stop the application"
    echo "  restart     Restart the application"
    echo "  update      Update the application"
    echo "  logs        View application logs"
    echo "  status      Show service status"
    echo "  cleanup     Clean up Docker resources"
    echo "  cloud       Show cloud deployment options"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy    # Deploy locally"
    echo "  $0 logs      # View logs"
    echo "  $0 status    # Check status"
}

# Main script logic
case "${1:-help}" in
    deploy)
        check_prerequisites
        deploy_local
        ;;
    stop)
        stop_local
        ;;
    restart)
        restart_local
        ;;
    update)
        update_local
        ;;
    logs)
        view_logs
        ;;
    status)
        show_status
        ;;
    cleanup)
        cleanup
        ;;
    cloud)
        deploy_cloud
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
