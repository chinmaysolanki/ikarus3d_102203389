# Makefile for Furniture Recommendation Engine

.PHONY: help setup dev-backend dev-frontend smoke fmt lint test clean deps deploy deploy-stop deploy-restart deploy-logs deploy-status deploy-update deploy-cleanup

# Default target
help:
	@echo "Furniture Recommendation Engine - Available Commands:"
	@echo ""
	@echo "Setup:"
	@echo "  setup       Install all dependencies and setup environment"
	@echo "  deps        Install Python dependencies from requirements.txt"
	@echo ""
	@echo "Development:"
	@echo "  dev-backend Start backend server (http://localhost:8000)"
	@echo "  dev-frontend Start frontend server (http://localhost:3001)"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  smoke       Run health check smoke test"
	@echo "  fmt         Format code (Python + TypeScript)"
	@echo "  lint        Run linting (Python + TypeScript)"
	@echo "  test        Run Python tests"
	@echo ""
	@echo "Data Management:"
	@echo "  fetch-data  Download dataset from Google Drive (set DATA_DRIVE_URL)"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy      Deploy application with Docker"
	@echo "  deploy-stop Stop deployed application"
	@echo "  deploy-restart Restart deployed application"
	@echo "  deploy-logs View application logs"
	@echo "  deploy-status Check application status"
	@echo "  deploy-update Update application"
	@echo "  deploy-cleanup Clean up Docker resources"
	@echo ""
	@echo "Utilities:"
	@echo "  clean       Clean build artifacts and caches"

# Setup
setup:
	@echo "Setting up Furniture Recommendation Engine..."
	@echo "Installing Python dependencies..."
	pip install -r server/requirements.txt
	@echo "Installing Node.js dependencies..."
	cd web && npm install
	@echo "Creating environment file..."
	@if [ ! -f .env ]; then \
		cp env.example .env; \
		echo "Created .env file from template"; \
		echo "Please edit .env with your API keys (optional)"; \
	else \
		echo ".env file already exists"; \
	fi
	@echo "Creating data directory..."
	mkdir -p data/
	@echo "Setup complete!"

# Dependency management
deps:
	@echo "Installing Python dependencies..."
	pip install -r server/requirements.txt
	@echo "Dependencies installed!"

# Note: relock-deps, test-cold-start, and test-reranker commands removed
# as the corresponding files have been cleaned up

fetch-data:
	@echo "Fetching dataset from Google Drive..."
	python3 -m scripts.fetch_data --url $(DATA_DRIVE_URL)
	@echo "Dataset fetch complete!"

# Development servers
dev-backend:
	@echo "Starting backend server..."
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"
	python -m uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload

dev-frontend:
	@echo "Starting frontend server..."
	@echo "Frontend: http://localhost:3001"
	cd web && npm run dev -- --port 3001

# Testing & Quality
smoke:
	@echo "Running comprehensive smoke test..."
	python3 -c "import requests; print('✅ Backend health check:', requests.get('http://localhost:8000/health').json())"

fmt:
	@echo "Formatting Python code..."
	black server/ tests/
	ruff check --fix server/ tests/
	@echo "Formatting TypeScript code..."
	cd web && npm run format
	cd web && npm run lint:fix

lint:
	@echo "Running Python linting..."
	ruff check server/ tests/
	@echo "Running TypeScript linting..."
	cd web && npm run lint
	cd web && npm run typecheck

test:
	@echo "Running Python tests..."
	python -m pytest tests/ -v

# Deployment commands
deploy:
	@echo "Deploying application..."
	@./deploy.sh deploy

deploy-stop:
	@echo "Stopping application..."
	@./deploy.sh stop

deploy-restart:
	@echo "Restarting application..."
	@./deploy.sh restart

deploy-logs:
	@echo "Viewing application logs..."
	@./deploy.sh logs

deploy-status:
	@echo "Checking application status..."
	@./deploy.sh status

deploy-update:
	@echo "Updating application..."
	@./deploy.sh update

deploy-cleanup:
	@echo "Cleaning up Docker resources..."
	@./deploy.sh cleanup

# Utilities
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf build/
	rm -rf *.egg-info/
	rm -rf __pycache__/
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf .ruff_cache/
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "Clean complete!"