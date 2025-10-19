"""
Configuration settings for the Furniture Recommendation Engine.

This module handles all configuration settings using Pydantic BaseSettings
with environment variable support and validation.
"""

import os
from pathlib import Path
from typing import List, Optional
from pydantic import Field, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""
    
    # API Configuration
    api_title: str = "Furniture Recommendation Engine"
    api_version: str = "1.0.0"
    debug: bool = Field(default=False, description="Enable debug mode")
    
    # Server Configuration
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, ge=1000, le=65535, description="Server port")
    
    # Data Configuration
    data_dir: Path = Field(default="../data", description="Data directory path")
    products_csv: str = Field(default="products.csv", description="Products CSV filename")
    
    # Vector Store Configuration
    use_pinecone: bool = Field(default=False, description="Use Pinecone instead of FAISS")
    pinecone_api_key: Optional[str] = Field(default=None, description="Pinecone API key")
    pinecone_environment: Optional[str] = Field(default=None, description="Pinecone environment")
    pinecone_index_name: Optional[str] = Field(default="furniture", description="Pinecone index name")
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = Field(default=None, description="OpenAI API key")
    
    # Model Configuration
    embedding_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2", description="Embedding model")
    reranker_model: str = Field(default="cross-encoder/ms-marco-MiniLM-L-6-v2", description="Reranker model")
    clip_model: str = Field(default="openai/clip-vit-base-patch32", description="CLIP model")
    
    # CORS Configuration
    cors_origins: List[str] = Field(default=["http://localhost:3001", "http://localhost:5173"], description="CORS allowed origins")
    
    @validator('data_dir')
    def validate_data_dir(cls, v):
        """Validate data directory path."""
        if isinstance(v, str):
            v = Path(v)
        if not v.exists():
            v.mkdir(parents=True, exist_ok=True)
        return v
    
    @validator('port')
    def validate_port(cls, v):
        """Validate port range."""
        if not 1000 <= v <= 65535:
            raise ValueError('Port must be between 1000 and 65535')
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Global settings instance
settings = Settings()
