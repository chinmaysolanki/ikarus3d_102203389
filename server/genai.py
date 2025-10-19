"""
Generative AI service for the Furniture Recommendation Engine.

This module handles AI-generated product descriptions.
"""

from typing import Optional
from models import ProductMetadata

class GenerativeAI:
    """Generative AI service for product descriptions."""
    
    def __init__(self):
        self.initialized = False
    
    async def initialize(self):
        """Initialize the generative AI service."""
        self.initialized = True
    
    async def generate_description(self, product: ProductMetadata) -> str:
        """Generate a product description."""
        return f"Discover the {product.title} by {product.brand}. {product.description}"

# Global instance
genai = GenerativeAI()
