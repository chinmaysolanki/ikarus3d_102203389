"""
Constants for the Furniture Recommendation Engine.

This module contains all magic numbers, strings, and configuration constants
used throughout the application.
"""

class APIConstants:
    """API-related constants."""
    MAX_RECOMMENDATION_LIMIT = 50
    DEFAULT_PAGE_SIZE = 8
    MAX_PAGE_SIZE = 20

class CORSConstants:
    """CORS-related constants."""
    ALLOWED_ORIGINS = ["http://localhost:3001", "http://localhost:5173"]
    ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    ALLOWED_HEADERS = ["*"]

class ModelConstants:
    """Model-related constants."""
    EMBEDDING_DIMENSION = 384
    MAX_SEQUENCE_LENGTH = 512
    BATCH_SIZE = 32

class DataConstants:
    """Data processing constants."""
    DEFAULT_DATA_DIR = "../data"
    PRODUCTS_CSV_FILENAME = "products.csv"
    FAISS_INDEX_FILENAME = "faiss_index.bin"
    FAISS_METADATA_FILENAME = "faiss_metadata.json"
