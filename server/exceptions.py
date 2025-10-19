"""
Exception handling for the Furniture Recommendation Engine.

This module provides custom exception classes and error handling utilities.
"""

class FurnitureRecommendationError(Exception):
    """Base exception for furniture recommendation errors."""
    
    def __init__(self, message: str, status_code: int = 500, error_type: str = "GENERAL_ERROR", details: dict = None):
        self.message = message
        self.status_code = status_code
        self.error_type = error_type
        self.details = details or {}
        super().__init__(self.message)

def create_validation_error(message: str, details: dict = None) -> FurnitureRecommendationError:
    """Create a validation error."""
    return FurnitureRecommendationError(
        message=message,
        status_code=400,
        error_type="VALIDATION_ERROR",
        details=details
    )
