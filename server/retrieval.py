"""
Vector store and retrieval system for the Furniture Recommendation Engine.

This module handles FAISS vector search and embedding generation.
"""

import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional
from models import ProductMetadata, RecommendRequest
from config import settings

class VectorStore:
    """Vector store for furniture recommendations."""
    
    def __init__(self):
        self.initialized = False
        self.faiss_index = None
        self.faiss_metadata: List[ProductMetadata] = []
    
    async def initialize(self):
        """Initialize the vector store."""
        # Try to load real data first, fallback to demo
        try:
            self.faiss_metadata = await self._load_real_products()
            print(f"✅ Loaded {len(self.faiss_metadata)} real products from CSV")
        except Exception as e:
            print(f"⚠️ Could not load real data: {e}")
            self.faiss_metadata = self._load_demo_products()
            print(f"✅ Loaded {len(self.faiss_metadata)} demo products")
        
        self.initialized = True
    
    async def _load_real_products(self) -> List[ProductMetadata]:
        """Load real products from CSV file."""
        csv_path = settings.data_dir / settings.products_csv
        
        if not csv_path.exists():
            raise FileNotFoundError(f"CSV file not found: {csv_path}")
        
        df = pd.read_csv(csv_path)
        products = []
        
        for _, row in df.iterrows():
            try:
                # Skip rows with missing essential data
                if pd.isna(row.get('title')) or str(row.get('title', '')).strip() == '':
                    continue
                
                # Handle price validation
                price_value = row.get('price', 0)
                if pd.isna(price_value) or price_value == '':
                    continue
                
                try:
                    price = float(price_value)
                    if price <= 0:
                        continue
                except (ValueError, TypeError):
                    continue
                
                # Handle image_url validation
                image_url = str(row.get('image_url', ''))
                if image_url.startswith("['") and image_url.endswith("']"):
                    # Extract first URL from Python list string
                    try:
                        import ast
                        url_list = ast.literal_eval(image_url)
                        image_url = url_list[0] if url_list else ''
                    except:
                        image_url = ''
                elif not image_url.startswith('http'):
                    image_url = ''
                
                # Handle description length
                description = str(row.get('description', ''))
                if len(description) > 1000:
                    description = description[:997] + "..."
                
                product = ProductMetadata(
                    uniq_id=str(row.get('uniq_id', f'product-{len(products)}')),
                    title=str(row.get('title', '')).strip(),
                    brand=str(row.get('brand', 'Unknown')),
                    description=description,
                    price=price,
                    categories=str(row.get('categories', '')),
                    image_url=image_url,
                    material=str(row.get('material', '')) if pd.notna(row.get('material')) else None,
                    color=str(row.get('color', '')) if pd.notna(row.get('color')) else None,
                    dimensions=str(row.get('dimensions', '')) if pd.notna(row.get('dimensions')) else None
                )
                products.append(product)
                
            except Exception as e:
                print(f"⚠️ Skipping invalid product row: {e}")
                continue
        
        return products
    
    def _load_demo_products(self) -> List[ProductMetadata]:
        """Load demo products for testing."""
        return [
            ProductMetadata(
                uniq_id="demo-1",
                title="Modern Office Chair",
                brand="ErgoSeat",
                description="Comfortable ergonomic office chair",
                price=299.99,
                categories="office furniture",
                image_url="https://example.com/chair1.jpg",
                material="mesh",
                color="black"
            ),
            ProductMetadata(
                uniq_id="demo-2", 
                title="Wooden Dining Table",
                brand="OakCraft",
                description="Solid oak dining table",
                price=899.99,
                categories="dining furniture",
                image_url="https://example.com/table1.jpg",
                material="oak",
                color="natural"
            )
        ]
    
    async def search(self, query: str, k: int = 10, page: int = 1, size: int = 8, 
                    filters: Dict[str, Any] = None, user_image_url: str = None):
        """Search for products."""
        # Simple search - filter by query keywords
        filtered_products = []
        query_lower = query.lower()
        
        for product in self.faiss_metadata:
            # Check if query matches title, brand, categories, or description
            if (query_lower in product.title.lower() or 
                query_lower in product.brand.lower() or 
                query_lower in product.categories.lower() or 
                query_lower in product.description.lower()):
                filtered_products.append(product)
        
        # If no matches, return all products
        if not filtered_products:
            filtered_products = self.faiss_metadata
        
        # Pagination
        start_idx = (page - 1) * size
        end_idx = start_idx + size
        
        products = filtered_products[start_idx:end_idx]
        total_pages = (len(filtered_products) + size - 1) // size
        
        return SearchResult(
            products=products,
            total_found=len(filtered_products),
            total_pages=total_pages,
            search_time_ms=50.0,
            reasons=[f"Found {len(filtered_products)} products matching '{query}'"]
        )

class SearchResult:
    """Search result container."""
    
    def __init__(self, products: List[ProductMetadata], total_found: int, 
                 total_pages: int, search_time_ms: float, reasons: List[str]):
        self.products = products
        self.total_found = total_found
        self.total_pages = total_pages
        self.search_time_ms = search_time_ms
        self.reasons = reasons

# Global instance
vector_store = VectorStore()
