"""
Pydantic models for the Furniture Recommendation Engine.

This module defines all request/response models using Pydantic v2
with proper validation and serialization.
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional, Dict, Any, Union
from enum import Enum

from pydantic import BaseModel, Field, validator

class ProductStatus(str, Enum):
    """Product status enumeration."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    DISCONTINUED = "discontinued"

class ServiceHealthStatus(str, Enum):
    """Service health status enumeration."""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"

class ProductMetadata(BaseModel):
    """Product metadata model."""
    uniq_id: str = Field(..., description="Unique product identifier")
    title: str = Field(..., description="Product title")
    brand: str = Field(..., description="Product brand")
    description: str = Field(..., description="Product description")
    price: Decimal = Field(..., ge=0, description="Product price")
    categories: str = Field(..., description="Product categories")
    image_url: str = Field(..., description="Product image URL")
    material: Optional[str] = Field(None, description="Product material")
    color: Optional[str] = Field(None, description="Product color")
    dimensions: Optional[str] = Field(None, description="Product dimensions")
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat()
        }

class RecommendRequest(BaseModel):
    """Recommendation request model."""
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    k: int = Field(default=10, ge=1, le=50, description="Number of results")
    page: int = Field(default=1, ge=1, description="Page number")
    size: int = Field(default=8, ge=1, le=20, description="Page size")
    filters: Dict[str, Any] = Field(default_factory=dict, description="Search filters")
    user_image_url: Optional[str] = Field(None, description="User image URL for visual search")
    include_description: bool = Field(default=True, description="Include AI-generated descriptions")
    include_reason: bool = Field(default=True, description="Include search reasons")

class RecommendResponse(BaseModel):
    """Recommendation response model."""
    products: List[ProductMetadata] = Field(..., description="Recommended products")
    total_found: int = Field(..., ge=0, description="Total number of products found")
    total_pages: int = Field(..., ge=0, description="Total number of pages")
    search_time_ms: float = Field(..., ge=0, description="Search time in milliseconds")
    reasons: List[str] = Field(default_factory=list, description="Search reasons")
    descriptions: List[str] = Field(default_factory=list, description="AI-generated descriptions")
    query: str = Field(..., description="Original search query")

class AnalyticsSummary(BaseModel):
    """Analytics summary model."""
    total_products: int = Field(..., ge=0, description="Total number of products")
    total_brands: int = Field(..., ge=0, description="Total number of brands")
    total_categories: int = Field(..., ge=0, description="Total number of categories")
    price_stats: Dict[str, float] = Field(..., description="Price statistics")
    top_brands: List[Dict[str, Any]] = Field(..., description="Top brands")
    top_categories: List[Dict[str, Any]] = Field(..., description="Top categories")
    category_avg_prices: Optional[List[Dict[str, Any]]] = Field(None, description="Average prices by category")
    demo_mode: bool = Field(default=False, description="Whether running in demo mode")

class HealthResponse(BaseModel):
    """Health check response model."""
    status: ServiceHealthStatus = Field(..., description="Overall service status")
    services: Dict[str, str] = Field(..., description="Individual service statuses")
    version: str = Field(..., description="Application version")

class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
