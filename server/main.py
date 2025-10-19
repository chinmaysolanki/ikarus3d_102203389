"""
Furniture Recommendation Engine - Main FastAPI Application

A modern furniture recommendation system built with FastAPI, React, and ML models.
Developed by Chinmay Solanki with assistance from Cursor AI.

Features:
- Semantic search with FAISS/Pinecone
- Cross-encoder reranking
- Computer vision classification
- Generative AI descriptions
- Real-time analytics
"""

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Import our modules
from config import settings
from constants import APIConstants, CORSConstants
from exceptions import FurnitureRecommendationError, create_validation_error
from logging_utils import setup_logging, get_logger, log_api_request, log_error_with_context
from models import (
    RecommendRequest, RecommendResponse, AnalyticsSummary, 
    HealthResponse, ErrorResponse, ProductMetadata
)
from retrieval import vector_store
from genai import genai
from analytics import analytics
from cv_zero_shot import cv_classifier
from ingest import ingestion_pipeline
from cache import query_cache

# Setup logging
setup_logging()
logger = get_logger(__name__)

# Global services
services: Dict[str, Any] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    logger.info("Initializing furniture recommendation system...")
    
    try:
        # Initialize vector store
        logger.info("Initializing vector store...")
        await vector_store.initialize()
        services["vector_store"] = vector_store
        
        # Initialize generative AI
        logger.info("Initializing generative AI service...")
        await genai.initialize()
        services["genai"] = genai
        
        # Initialize computer vision
        logger.info("Initializing computer vision classifier...")
        await cv_classifier.initialize()
        services["cv_classifier"] = cv_classifier
        
        # Initialize analytics
        logger.info("Initializing analytics engine...")
        await analytics.initialize()
        services["analytics"] = analytics
        
        logger.info("All components initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise
    
    yield
    
    logger.info("Shutting down application...")
    # Cleanup if needed
    logger.info("Application shutdown completed")

# Create FastAPI app
app = FastAPI(
    title="Furniture Recommendation Engine",
    description="A modern furniture recommendation system with ML-powered search and analytics",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORSConstants.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=CORSConstants.ALLOWED_METHODS,
    allow_headers=CORSConstants.ALLOWED_HEADERS,
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests and responses."""
    start_time = asyncio.get_event_loop().time()
    
    response = await call_next(request)
    
    process_time = (asyncio.get_event_loop().time() - start_time) * 1000
    log_api_request(request, response, process_time)
    
    return response

# Global exception handlers
@app.exception_handler(FurnitureRecommendationError)
async def furniture_error_handler(request: Request, exc: FurnitureRecommendationError):
    """Handle custom furniture recommendation errors."""
    log_error_with_context(exc, request)
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.error_type,
            message=exc.message,
            details=exc.details
        ).model_dump()
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    log_error_with_context(exc, request)
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error="HTTP_ERROR",
            message=exc.detail,
            details={"status_code": exc.status_code}
        ).model_dump()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions."""
    log_error_with_context(exc, request)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="INTERNAL_ERROR",
            message="An unexpected error occurred",
            details={"type": type(exc).__name__}
        ).model_dump()
    )

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with service status."""
    try:
        # Check all services
        vector_store_status = "healthy" if services.get("vector_store", {}).initialized else "unhealthy"
        genai_status = "healthy" if services.get("genai", {}).initialized else "unhealthy"
        cv_status = "healthy" if services.get("cv_classifier", {}).initialized else "unhealthy"
        analytics_status = "healthy" if services.get("analytics", {}).initialized else "unhealthy"
        
        overall_status = "healthy" if all([
            vector_store_status == "healthy",
            genai_status == "healthy", 
            cv_status == "healthy",
            analytics_status == "healthy"
        ]) else "degraded"
        
        return HealthResponse(
            status=overall_status,
            services={
                "vector_store": vector_store_status,
                "generative_ai": genai_status,
                "computer_vision": cv_status,
                "analytics": analytics_status
            },
            version="1.0.0"
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            services={},
            version="1.0.0"
        )

# Recommendation endpoint
@app.post("/api/recommend", response_model=RecommendResponse)
async def recommend_furniture(request: RecommendRequest):
    """Get furniture recommendations based on query."""
    try:
        # Validate services are available
        if not services.get("vector_store", {}).initialized:
            raise HTTPException(status_code=503, detail="Vector store not available")
        
        # Perform search
        results = await vector_store.search(
            query=request.query,
            k=request.k,
            page=request.page,
            size=request.size,
            filters=request.filters,
            user_image_url=request.user_image_url
        )
        
        # Generate descriptions if requested
        descriptions = []
        if request.include_description and services.get("genai", {}).initialized:
            for product in results.products:
                try:
                    desc = await genai.generate_description(product)
                    descriptions.append(desc)
                except Exception as e:
                    logger.warning(f"Failed to generate description for {product.uniq_id}: {e}")
                    descriptions.append("")
        
        return RecommendResponse(
            products=results.products,
            total_found=results.total_found,
            total_pages=results.total_pages,
            search_time_ms=results.search_time_ms,
            reasons=results.reasons,
            descriptions=descriptions,
            query=request.query
        )
        
    except Exception as e:
        logger.error(f"Recommendation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Analytics endpoints
@app.get("/api/analytics/summary", response_model=AnalyticsSummary)
async def get_analytics_summary():
    """Get analytics summary."""
    try:
        if not services.get("analytics", {}).initialized:
            raise HTTPException(status_code=503, detail="Analytics service not available")
        
        summary = await analytics.get_summary()
        return summary
        
    except Exception as e:
        logger.error(f"Analytics summary failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/clear-cache")
async def clear_analytics_cache():
    """Clear analytics cache to force reload."""
    try:
        analytics.clear_cache()
        return {"message": "Analytics cache cleared successfully"}
    except Exception as e:
        logger.error(f"Error clearing analytics cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear cache")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
