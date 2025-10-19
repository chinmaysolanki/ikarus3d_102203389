# Architecture Overview

## System Overview

The AI Furniture Recommendations system is a full-stack application that provides intelligent furniture recommendations using vector search, machine learning, and generative AI. The system processes product data through a pipeline from ingestion to user-facing recommendations.

## Data Flow

```
CSV Data → Ingestion → Embeddings → Vector Index → Retrieval → Reranking → API → UI
    ↓           ↓           ↓            ↓           ↓          ↓        ↓      ↓
  Products   Pipeline   Text/Image   FAISS/     Hybrid    Cross-   FastAPI  React
             Batch     Embeddings   Pinecone   Search    Encoder   REST    Frontend
```

## Key Modules

### Backend (`server/`)

| Module | Purpose | Key Components |
|--------|---------|----------------|
| `main.py` | FastAPI application entry point | API endpoints, middleware, error handling |
| `config.py` | Configuration management | Environment variables, settings validation |
| `constants.py` | Application constants | Magic numbers, configuration values |
| `models.py` | Pydantic data models | Request/response validation, type safety |
| `exceptions.py` | Custom exception hierarchy | Domain-specific error handling |
| `logging_utils.py` | Structured logging | JSON logging, performance metrics |
| `retrieval.py` | Vector search engine | FAISS/Pinecone integration, hybrid search |
| `genai.py` | Generative AI service | OpenAI API, fallback models |
| `cv_zero_shot.py` | Computer vision | CLIP model, image classification |
| `analytics.py` | Data analytics | Product statistics, insights |
| `ingest.py` | Data ingestion | CSV processing, batch operations |
| `cache.py` | Query caching | LRU cache, performance optimization |

### Frontend (`web/`)

| Module | Purpose | Key Components |
|--------|---------|----------------|
| `src/App.tsx` | Main React application | Routing, state management |
| `src/pages/` | Page components | Home, Analytics, Product views |
| `src/services/` | API client | HTTP requests, error handling |
| `src/types/` | TypeScript types | API response interfaces |

### Data (`data/`)

| File | Purpose | Format |
|------|---------|--------|
| `products.csv` | Product catalog | CSV with metadata |
| `faiss_index.bin` | Vector index | Binary FAISS index |
| `faiss_metadata.json` | Index metadata | JSON with product mappings |

## Sequence Diagrams

### Recommendation Flow

```
User → Frontend → API → CV Classifier → Vector Store → Reranker → GenAI → Response
  ↓        ↓        ↓         ↓             ↓           ↓         ↓        ↓
Query   React   FastAPI   CLIP Model    FAISS/Pinecone Cross-Encoder OpenAI  JSON
+ Image  UI      REST     Image→Vector   Hybrid Search  Reranking   Descriptions
```

**Detailed Flow:**
1. User submits search query + optional image
2. Frontend sends POST request to `/api/recommend`
3. API validates request and processes image (if provided)
4. CV Classifier encodes image to vector using CLIP
5. Vector Store performs hybrid search (text + image vectors)
6. Cross-Encoder reranks results for better relevance
7. GenAI generates product descriptions (if requested)
8. API returns structured JSON response
9. Frontend displays recommendations with analytics

### Data Ingestion Flow

```
CSV File → Ingestion Pipeline → Embedding Service → Vector Store → Metadata Storage
    ↓            ↓                    ↓                ↓              ↓
Products    Validation &         Sentence-BERT      FAISS Index    JSON Metadata
Catalog      Cleaning           Text→Vectors       Binary File     Product Mappings
```

**Detailed Flow:**
1. Admin uploads CSV file with product data
2. Ingestion Pipeline validates and cleans data
3. Embedding Service generates text embeddings using Sentence-BERT
4. Vector Store builds FAISS index from embeddings
5. Metadata stored in JSON format for product lookups
6. System ready for recommendation queries

## Technology Stack

### Backend
- **FastAPI**: Web framework with automatic OpenAPI docs
- **Pydantic**: Data validation and serialization
- **FAISS**: Vector similarity search (primary)
- **Pinecone**: Cloud vector database (optional)
- **OpenAI API**: Generative AI for descriptions
- **Hugging Face**: Local ML models (fallback)
- **Sentence-BERT**: Text embeddings
- **CLIP**: Image embeddings and classification
- **Cross-Encoder**: Reranking for improved relevance

### Frontend
- **React 18**: UI framework with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization
- **Axios**: HTTP client

### Infrastructure
- **Python 3.11+**: Backend runtime
- **Node.js 18+**: Frontend build environment
- **Docker**: Containerization (optional)
- **Git**: Version control

## Performance Characteristics

| Operation | Typical Latency | Throughput |
|-----------|----------------|------------|
| Text Search | 50-200ms | 100+ req/s |
| Image Search | 200-500ms | 50+ req/s |
| Hybrid Search | 100-300ms | 75+ req/s |
| Description Generation | 1-3s | 20+ req/s |
| Data Ingestion | 10-30s | Batch processing |

## Scalability Considerations

- **Vector Search**: FAISS supports millions of vectors efficiently
- **Caching**: Query results cached to reduce computation
- **Async Processing**: Non-blocking I/O for better concurrency
- **Batch Operations**: Efficient bulk processing for ingestion
- **Fallback Systems**: Graceful degradation when services unavailable

## Security & Reliability

- **Input Validation**: Comprehensive Pydantic models
- **Error Handling**: Structured exception hierarchy
- **Logging**: Structured JSON logs for monitoring
- **Health Checks**: Service availability monitoring
- **CORS**: Configured for development and production
- **Type Safety**: Full TypeScript/Python type coverage
