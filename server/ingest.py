"""
Data ingestion pipeline for the Furniture Recommendation Engine.

This module handles data loading and processing.
"""

class IngestionPipeline:
    """Data ingestion pipeline."""
    
    def __init__(self):
        self.initialized = False
    
    async def initialize(self):
        """Initialize the ingestion pipeline."""
        self.initialized = True

# Global instance
ingestion_pipeline = IngestionPipeline()
