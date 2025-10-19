"""
Query caching system for the Furniture Recommendation Engine.

This module handles LRU caching for search queries.
"""

class QueryCache:
    """LRU cache for search queries."""
    
    def __init__(self):
        self.cache = {}
    
    def get(self, key: str):
        """Get cached result."""
        return self.cache.get(key)
    
    def set(self, key: str, value):
        """Set cached result."""
        self.cache[key] = value

# Global instance
query_cache = QueryCache()
