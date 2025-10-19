"""
Logging utilities for the Furniture Recommendation Engine.

This module provides structured logging configuration and utilities.
"""

import logging
import json
from datetime import datetime
from typing import Any, Dict

def setup_logging():
    """Setup structured logging configuration."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance."""
    return logging.getLogger(name)

def log_api_request(request, response, process_time: float):
    """Log API request and response."""
    logger = get_logger("api_requests")
    logger.info(f"API {request.method} {request.url.path} -> {response.status_code} ({process_time:.2f}ms)")

def log_error_with_context(error: Exception, request=None):
    """Log error with context."""
    logger = get_logger("errors")
    logger.error(f"Error: {error}", exc_info=True)

def log_performance(operation: str, duration: float):
    """Log performance metrics."""
    logger = get_logger("performance")
    logger.info(f"Performance: {operation} completed in {duration:.2f}ms")
