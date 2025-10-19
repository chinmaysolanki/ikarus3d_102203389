"""
Analytics engine for the Furniture Recommendation Engine.

This module handles data analytics and insights.
"""

import pandas as pd
from pathlib import Path
from typing import Dict, Any, List
from models import AnalyticsSummary
from config import settings

class Analytics:
    """Analytics engine for furniture data."""
    
    def __init__(self):
        self.initialized = False
        self.products_cache = None
        self.demo_mode = True
    
    async def initialize(self):
        """Initialize the analytics engine."""
        # Try to load real data
        try:
            await self._load_real_data()
            self.demo_mode = False
            print(f"✅ Analytics loaded {len(self.products_cache)} real products")
        except Exception as e:
            print(f"⚠️ Analytics using demo mode: {e}")
            self.demo_mode = True
        
        self.initialized = True
    
    async def _load_real_data(self):
        """Load real product data for analytics."""
        csv_path = settings.data_dir / settings.products_csv
        
        if not csv_path.exists():
            raise FileNotFoundError(f"CSV file not found: {csv_path}")
        
        df = pd.read_csv(csv_path)
        
        # Filter valid products
        valid_products = []
        for _, row in df.iterrows():
            if (pd.notna(row.get('title')) and 
                str(row.get('title', '')).strip() != '' and
                pd.notna(row.get('price')) and 
                float(row.get('price', 0)) > 0):
                valid_products.append(row)
        
        self.products_cache = pd.DataFrame(valid_products)
    
    async def get_summary(self) -> AnalyticsSummary:
        """Get analytics summary."""
        if self.demo_mode:
            return AnalyticsSummary(
                total_products=215,
                total_brands=25,
                total_categories=8,
                price_stats={
                    "min": 50.0,
                    "max": 2500.0,
                    "mean": 450.0,
                    "median": 350.0
                },
                top_brands=[
                    {"brand": "IKEA", "count": 45},
                    {"brand": "West Elm", "count": 32},
                    {"brand": "Crate & Barrel", "count": 28}
                ],
                top_categories=[
                    {"category": "home & kitchen", "count": 172},
                    {"category": "furniture", "count": 137},
                    {"category": "living room furniture", "count": 48}
                ],
                demo_mode=True
            )
        else:
            # Calculate real analytics from loaded data
            df = self.products_cache
            
            # Price statistics
            prices = df['price'].dropna()
            price_stats = {
                "min": float(prices.min()),
                "max": float(prices.max()),
                "mean": float(prices.mean()),
                "median": float(prices.median())
            }
            
            # Brand statistics
            brand_counts = df['brand'].value_counts().head(10)
            top_brands = [{"brand": brand, "count": int(count)} for brand, count in brand_counts.items()]
            
            # Category statistics
            category_counts = df['categories'].value_counts().head(10)
            top_categories = [{"category": cat, "count": int(count)} for cat, count in category_counts.items()]
            
            return AnalyticsSummary(
                total_products=len(df),
                total_brands=df['brand'].nunique(),
                total_categories=df['categories'].nunique(),
                price_stats=price_stats,
                top_brands=top_brands,
                top_categories=top_categories,
                demo_mode=False
            )
    
    def clear_cache(self):
        """Clear analytics cache."""
        self.products_cache = None

# Global instance
analytics = Analytics()
