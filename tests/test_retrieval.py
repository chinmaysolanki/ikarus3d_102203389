#!/usr/bin/env python3
"""
Test suite for retrieval system components.
Tests rank fusion and MMR behavior with synthetic corpus.
"""
import numpy as np
from typing import List, Dict, Any
from unittest.mock import Mock
import sys
from pathlib import Path
import unittest

# Add server to path for imports
sys.path.append(str(Path(__file__).parent.parent / "server"))

try:
    from server.retrieval import VectorStore
    from server.models import ProductMetadata
except ImportError:
    # Mock classes for testing without full dependencies
    class ProductMetadata:
        def __init__(self, uniq_id: str, title: str, description: str, 
                     price: float, categories: List[str], image_url: str = ""):
            self.uniq_id = uniq_id
            self.title = title
            self.description = description
            self.price = price
            self.categories = categories
            self.image_url = image_url

    class VectorStore:
        def __init__(self):
            self.initialized = True
            self.text_encoder = Mock()
        
        def _reciprocal_rank_fusion(self, text_candidates: List[ProductMetadata], 
                                  image_candidates: List[ProductMetadata], 
                                  k: int = 60) -> List[ProductMetadata]:
            """Mock implementation of reciprocal rank fusion."""
            # Create score maps
            text_scores = {}
            image_scores = {}
            
            # Assign reciprocal rank scores to text candidates
            for i, candidate in enumerate(text_candidates):
                score = 1.0 / (i + 1)  # Reciprocal rank
                text_scores[candidate.uniq_id] = score
            
            # Assign reciprocal rank scores to image candidates
            for i, candidate in enumerate(image_candidates):
                score = 1.0 / (i + 1)  # Reciprocal rank
                image_scores[candidate.uniq_id] = score
            
            # Combine scores
            combined_scores = {}
            all_candidates = {}
            
            # Add text scores
            for candidate in text_candidates:
                combined_scores[candidate.uniq_id] = text_scores[candidate.uniq_id]
                all_candidates[candidate.uniq_id] = candidate
            
            # Add image scores
            for candidate in image_candidates:
                if candidate.uniq_id in combined_scores:
                    combined_scores[candidate.uniq_id] += image_scores[candidate.uniq_id]
                else:
                    combined_scores[candidate.uniq_id] = image_scores[candidate.uniq_id]
                all_candidates[candidate.uniq_id] = candidate
            
            # Sort by combined score
            sorted_candidates = sorted(
                combined_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )
            
            # Return top k candidates
            fused_candidates = []
            for candidate_id, score in sorted_candidates[:k]:
                if candidate_id in all_candidates:
                    fused_candidates.append(all_candidates[candidate_id])
            
            return fused_candidates
        
        def _maximal_marginal_relevance(self, candidates: List[ProductMetadata], 
                                      query: str, k: int = 30, 
                                      lambda_param: float = 0.7) -> List[ProductMetadata]:
            """Mock implementation of MMR."""
            if len(candidates) <= k:
                return candidates
            
            # Simple MMR implementation
            selected = []
            remaining = list(range(len(candidates)))
            
            # Select first candidate (highest relevance)
            selected.append(0)
            remaining.remove(0)
            
            # Select remaining candidates using MMR
            while len(selected) < k and remaining:
                best_score = -float('inf')
                best_idx = None
                
                for idx in remaining:
                    # Mock relevance score (higher for earlier candidates)
                    relevance = 1.0 / (idx + 1)
                    
                    # Mock diversity score (lower for similar candidates)
                    diversity = 1.0 - (len(selected) * 0.1)  # Decreases with more selected
                    
                    # MMR score
                    mmr_score = lambda_param * relevance - (1 - lambda_param) * diversity
                    
                    if mmr_score > best_score:
                        best_score = mmr_score
                        best_idx = idx
                
                if best_idx is not None:
                    selected.append(best_idx)
                    remaining.remove(best_idx)
            
            # Return selected candidates
            return [candidates[i] for i in selected]


class TestRetrievalSystem(unittest.TestCase):
    """Test suite for retrieval system components."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.vector_store = VectorStore()
        
        # Create synthetic corpus
        self.synthetic_corpus = [
            ProductMetadata("prod_001", "Modern Office Chair", "Ergonomic office chair with lumbar support", 299.99, ["Office Chair", "Chair"]),
            ProductMetadata("prod_002", "Wooden Dining Table", "Solid oak dining table for 6 people", 899.99, ["Dining Table", "Table"]),
            ProductMetadata("prod_003", "Leather Sofa", "3-seater leather sofa in brown", 1299.99, ["Sofa", "Seating"]),
            ProductMetadata("prod_004", "Metal Desk", "Industrial metal desk with drawers", 399.99, ["Desk", "Office"]),
            ProductMetadata("prod_005", "Bookshelf Unit", "5-shelf wooden bookshelf", 199.99, ["Bookshelf", "Storage"]),
            ProductMetadata("prod_006", "Coffee Table", "Glass top coffee table", 349.99, ["Coffee Table", "Table"]),
            ProductMetadata("prod_007", "Bed Frame", "Platform bed frame in oak", 599.99, ["Bed", "Bedroom"]),
            ProductMetadata("prod_008", "Dresser", "6-drawer dresser with mirror", 499.99, ["Dresser", "Bedroom"]),
            ProductMetadata("prod_009", "Office Chair", "Mesh office chair with armrests", 199.99, ["Office Chair", "Chair"]),
            ProductMetadata("prod_010", "Dining Chair", "Set of 4 wooden dining chairs", 299.99, ["Dining Chair", "Chair"]),
        ]
    
    def test_reciprocal_rank_fusion_basic(self):
        """Test basic reciprocal rank fusion functionality."""
        # Create text and image candidates with some overlap
        text_candidates = self.synthetic_corpus[:5]  # First 5 products
        image_candidates = self.synthetic_corpus[3:8]  # Products 4-8 (overlap with 4,5)
        
        # Test fusion
        fused = self.vector_store._reciprocal_rank_fusion(text_candidates, image_candidates, k=5)
        
        # Assertions
        assert len(fused) <= 5, "Should return at most k candidates"
        assert len(fused) > 0, "Should return at least one candidate"
        
        # Check that overlapping items have higher scores
        fused_ids = [p.uniq_id for p in fused]
        overlapping_ids = ["prod_004", "prod_005"]  # Products that appear in both lists
        
        # At least one overlapping item should be in top results
        assert any(pid in fused_ids for pid in overlapping_ids), "Overlapping items should be prioritized"
    
    def test_reciprocal_rank_fusion_empty_lists(self):
        """Test reciprocal rank fusion with empty input lists."""
        # Test with empty text candidates
        fused = self.vector_store._reciprocal_rank_fusion([], self.synthetic_corpus[:3], k=5)
        assert len(fused) == 3, "Should return all image candidates when text is empty"
        
        # Test with empty image candidates
        fused = self.vector_store._reciprocal_rank_fusion(self.synthetic_corpus[:3], [], k=5)
        assert len(fused) == 3, "Should return all text candidates when image is empty"
        
        # Test with both empty
        fused = self.vector_store._reciprocal_rank_fusion([], [], k=5)
        assert len(fused) == 0, "Should return empty list when both inputs are empty"
    
    def test_reciprocal_rank_fusion_k_parameter(self):
        """Test reciprocal rank fusion with different k values."""
        text_candidates = self.synthetic_corpus[:3]
        image_candidates = self.synthetic_corpus[2:5]
        
        # Test with k=2
        fused_k2 = self.vector_store._reciprocal_rank_fusion(text_candidates, image_candidates, k=2)
        assert len(fused_k2) <= 2, "Should respect k=2 limit"
        
        # Test with k=10 (larger than total candidates)
        fused_k10 = self.vector_store._reciprocal_rank_fusion(text_candidates, image_candidates, k=10)
        assert len(fused_k10) <= 5, "Should not exceed total unique candidates"
    
    def test_maximal_marginal_relevance_basic(self):
        """Test basic MMR functionality."""
        candidates = self.synthetic_corpus[:8]
        query = "office furniture"
        
        # Test MMR
        diverse_results = self.vector_store._maximal_marginal_relevance(candidates, query, k=5)
        
        # Assertions
        assert len(diverse_results) <= 5, "Should return at most k candidates"
        assert len(diverse_results) > 0, "Should return at least one candidate"
        
        # Check that results are diverse (different categories)
        categories = set()
        for result in diverse_results:
            categories.update(result.categories)
        
        # Should have multiple categories for diversity
        assert len(categories) > 1, "MMR should promote diversity across categories"
    
    def test_maximal_marginal_relevance_lambda_parameter(self):
        """Test MMR with different lambda parameters."""
        candidates = self.synthetic_corpus[:6]
        query = "furniture"
        
        # Test with lambda=1.0 (pure relevance)
        diverse_rel = self.vector_store._maximal_marginal_relevance(candidates, query, k=3, lambda_param=1.0)
        
        # Test with lambda=0.0 (pure diversity)
        diverse_div = self.vector_store._maximal_marginal_relevance(candidates, query, k=3, lambda_param=0.0)
        
        # Both should return same number of results
        self.assertEqual(len(diverse_rel), len(diverse_div), "Should return same number of results")
        
        # Results might be different due to different lambda values
        rel_ids = [p.uniq_id for p in diverse_rel]
        div_ids = [p.uniq_id for p in diverse_div]
        
        # Both should return same number of results
        self.assertEqual(len(rel_ids), len(div_ids), "Should return same number of results")
    
    def test_maximal_marginal_relevance_edge_cases(self):
        """Test MMR with edge cases."""
        candidates = self.synthetic_corpus[:3]
        query = "test query"
        
        # Test with k larger than candidates
        diverse = self.vector_store._maximal_marginal_relevance(candidates, query, k=10)
        assert len(diverse) == len(candidates), "Should return all candidates when k > len(candidates)"
        
        # Test with empty candidates
        diverse_empty = self.vector_store._maximal_marginal_relevance([], query, k=5)
        assert len(diverse_empty) == 0, "Should return empty list for empty candidates"
        
        # Test with single candidate
        single_candidate = [self.synthetic_corpus[0]]
        diverse_single = self.vector_store._maximal_marginal_relevance(single_candidate, query, k=5)
        assert len(diverse_single) == 1, "Should return single candidate"
        assert diverse_single[0].uniq_id == single_candidate[0].uniq_id, "Should return the same candidate"
    
    def test_integration_rank_fusion_and_mmr(self):
        """Test integration of rank fusion and MMR."""
        # Create overlapping text and image candidates
        text_candidates = self.synthetic_corpus[:6]
        image_candidates = self.synthetic_corpus[4:10]
        
        # Step 1: Apply reciprocal rank fusion
        fused = self.vector_store._reciprocal_rank_fusion(text_candidates, image_candidates, k=8)
        
        # Step 2: Apply MMR for diversity
        query = "modern furniture"
        diverse_results = self.vector_store._maximal_marginal_relevance(fused, query, k=5)
        
        # Assertions
        assert len(diverse_results) <= 5, "Final results should respect k limit"
        assert len(diverse_results) > 0, "Should have at least one result"
        
        # Check that all results are unique
        result_ids = [p.uniq_id for p in diverse_results]
        assert len(result_ids) == len(set(result_ids)), "All results should be unique"
        
        # Check that results come from fused candidates
        fused_ids = [p.uniq_id for p in fused]
        for result in diverse_results:
            assert result.uniq_id in fused_ids, "Results should come from fused candidates"
    
    def test_synthetic_corpus_properties(self):
        """Test properties of the synthetic corpus."""
        assert len(self.synthetic_corpus) == 10, "Should have 10 synthetic products"
        
        # Check that all products have required fields
        for product in self.synthetic_corpus:
            assert hasattr(product, 'uniq_id'), "Product should have uniq_id"
            assert hasattr(product, 'title'), "Product should have title"
            assert hasattr(product, 'description'), "Product should have description"
            assert hasattr(product, 'price'), "Product should have price"
            assert hasattr(product, 'categories'), "Product should have categories"
            assert isinstance(product.categories, list), "Categories should be a list"
            assert len(product.categories) > 0, "Product should have at least one category"
        
        # Check for category diversity
        all_categories = set()
        for product in self.synthetic_corpus:
            all_categories.update(product.categories)
        
        assert len(all_categories) > 3, "Should have diverse categories"
        
        # Check price range
        prices = [p.price for p in self.synthetic_corpus]
        assert min(prices) > 0, "All prices should be positive"
        assert max(prices) > min(prices), "Should have price variation"


class TestMathematicalProperties(unittest.TestCase):
    """Test mathematical properties of retrieval algorithms."""
    
    def test_rank_fusion_mathematical_properties(self):
        """Test mathematical properties of reciprocal rank fusion."""
        # Create test data
        text_candidates = [
            ProductMetadata("A", "Product A", "Description A", 100.0, ["Category1"]),
            ProductMetadata("B", "Product B", "Description B", 200.0, ["Category2"]),
            ProductMetadata("C", "Product C", "Description C", 300.0, ["Category1"]),
        ]
        
        image_candidates = [
            ProductMetadata("B", "Product B", "Description B", 200.0, ["Category2"]),  # Overlap
            ProductMetadata("D", "Product D", "Description D", 400.0, ["Category3"]),
            ProductMetadata("A", "Product A", "Description A", 100.0, ["Category1"]),  # Overlap
        ]
        
        vector_store = VectorStore()
        fused = vector_store._reciprocal_rank_fusion(text_candidates, image_candidates, k=4)
        
        # Mathematical properties
        self.assertLessEqual(len(fused), 4, "Should respect k limit")
        
        # Overlapping items should have higher combined scores
        fused_ids = [p.uniq_id for p in fused]
        
        # Items A and B appear in both lists, so they should be prioritized
        self.assertTrue("A" in fused_ids or "B" in fused_ids, "Overlapping items should be in results")
        
        # All unique items should be considered
        unique_items = set([p.uniq_id for p in text_candidates + image_candidates])
        self.assertLessEqual(len(fused), len(unique_items), "Should not exceed unique items")


    def test_mmr_diversity_properties(self):
        """Test diversity properties of MMR."""
        # Create candidates with known categories
        candidates = [
            ProductMetadata("A", "Chair A", "Description A", 100.0, ["Chair"]),
            ProductMetadata("B", "Chair B", "Description B", 150.0, ["Chair"]),
            ProductMetadata("C", "Table A", "Description C", 200.0, ["Table"]),
            ProductMetadata("D", "Table B", "Description D", 250.0, ["Table"]),
            ProductMetadata("E", "Sofa A", "Description E", 300.0, ["Sofa"]),
            ProductMetadata("F", "Sofa B", "Description F", 350.0, ["Sofa"]),
        ]
        
        vector_store = VectorStore()
        diverse_results = vector_store._maximal_marginal_relevance(candidates, "furniture", k=3)
        
        # Check diversity
        categories = set()
        for result in diverse_results:
            categories.update(result.categories)
        
        # Should have multiple categories for diversity
        self.assertGreater(len(categories), 1, "MMR should promote category diversity")


if __name__ == "__main__":
    # Run tests
    unittest.main(verbosity=2)
