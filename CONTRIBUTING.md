# Contributing Guidelines

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ikarus-project
   ```

2. **Backend setup**
   ```bash
   # Install Python dependencies
   pip install -r server/requirements.txt
   
   # Copy environment template
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend setup**
   ```bash
   # Install Node.js dependencies
   cd web
   npm install
   ```

4. **Run the application**
   ```bash
   # Start backend (from project root)
   make dev-backend
   
   # Start frontend (in another terminal)
   make dev-frontend
   ```

## Development Workflow

### Code Style

#### Python (Backend)
- **Formatting**: Use `black` for code formatting
- **Linting**: Use `flake8` for linting
- **Type Hints**: All functions must have complete type hints
- **Docstrings**: Use Google-style docstrings with PURPOSE, INPUTS, OUTPUTS, TRADE-OFFS

```python
def example_function(param: str) -> int:
    """
    Example function with proper documentation.
    
    PURPOSE: Brief description of what this function does
    INPUTS: Description of input parameters
    OUTPUTS: Description of return value
    TRADE-OFFS:
      - Pro: Benefits of this approach
      - Con: Drawbacks or limitations
    """
    return len(param)
```

#### TypeScript (Frontend)
- **Formatting**: Use Prettier for code formatting
- **Linting**: Use ESLint for linting
- **Type Safety**: All components and functions must be properly typed
- **Comments**: Use JSDoc for complex functions

```typescript
/**
 * Example function with proper TypeScript typing
 * @param param - Description of parameter
 * @returns Description of return value
 */
const exampleFunction = (param: string): number => {
  return param.length;
};
```

### Commit Message Convention

Use **Conventional Commits** format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples
```bash
feat(api): add product recommendation endpoint
fix(search): resolve vector search timeout issue
docs(readme): update installation instructions
refactor(models): improve Pydantic validation
test(analytics): add unit tests for analytics engine
chore(deps): update dependencies
```

### Testing

#### Backend Testing
```bash
# Run all tests
make test

# Run specific test file
python -m pytest server/tests/test_models.py -v

# Run with coverage
python -m pytest --cov=server server/tests/
```

#### Frontend Testing
```bash
cd web
npm test
npm run test:coverage
```

### Code Quality Checks

#### Backend
```bash
# Format code
make fmt

# Lint code
make lint

# Type checking
mypy server/

# Security check
bandit -r server/
```

#### Frontend
```bash
cd web
npm run lint
npm run type-check
npm run build
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Run quality checks**
   ```bash
   make fmt
   make lint
   make test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request via GitHub interface
   ```

### PR Requirements
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No linting errors
- [ ] Type hints complete (Python)
- [ ] TypeScript types complete (Frontend)

## Project Structure

```
ikarus-project/
├── server/                 # Backend Python code
│   ├── main.py            # FastAPI application
│   ├── config.py          # Configuration management
│   ├── constants.py       # Application constants
│   ├── models.py          # Pydantic data models
│   ├── exceptions.py      # Custom exceptions
│   ├── logging_utils.py   # Structured logging
│   ├── retrieval.py       # Vector search engine
│   ├── genai.py          # Generative AI service
│   ├── cv_zero_shot.py   # Computer vision
│   ├── analytics.py      # Data analytics
│   ├── ingest.py         # Data ingestion
│   └── cache.py          # Query caching
├── web/                   # Frontend React code
│   ├── src/
│   │   ├── App.tsx       # Main application
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   └── types/        # TypeScript types
│   └── package.json
├── notebooks/             # Jupyter notebooks
│   ├── 01_analytics.ipynb
│   └── 02_training.ipynb
├── data/                  # Data files
├── scripts/               # Utility scripts
├── docs/                  # Documentation
└── Makefile              # Development commands
```

## Development Commands

### Backend Commands
```bash
make dev-backend          # Start development server
make test                 # Run tests
make fmt                  # Format code
make lint                 # Lint code
make smoke                # Smoke test
make fetch-data           # Download sample data
```

### Frontend Commands
```bash
make dev-frontend         # Start development server
cd web && npm run build   # Build for production
cd web && npm run lint    # Lint code
cd web && npm test        # Run tests
```

## Environment Variables

### Required
- `PINECONE_API_KEY`: Pinecone API key (optional)
- `OPENAI_API_KEY`: OpenAI API key (optional)

### Optional
- `DEBUG`: Enable debug mode (default: false)
- `API_PORT`: Backend port (default: 8000)
- `DEFAULT_K`: Default search results (default: 10)
- `MAX_K`: Maximum search results (default: 50)

## Troubleshooting

### Common Issues

1. **Import errors**
   ```bash
   # Ensure you're in the correct directory
   cd ikarus-project
   # Install dependencies
   pip install -r server/requirements.txt
   ```

2. **Port conflicts**
   ```bash
   # Check if port is in use
   lsof -i :8000
   # Change port in .env file
   API_PORT=8001
   ```

3. **Frontend build errors**
   ```bash
   cd web
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

- Check existing issues in the repository
- Create a new issue with detailed description
- Include error messages and environment details
- Provide steps to reproduce the problem

## Code Review Guidelines

### For Reviewers
- Check code style and formatting
- Verify tests are included
- Ensure documentation is updated
- Validate error handling
- Check for security issues

### For Authors
- Keep PRs focused and small
- Write clear commit messages
- Include tests for new features
- Update documentation
- Respond to review feedback promptly

## Release Process

1. **Version bump**: Update version in `server/config.py` and `web/package.json`
2. **Changelog**: Update `CHANGELOG.md` with new features/fixes
3. **Testing**: Run full test suite
4. **Build**: Ensure both backend and frontend build successfully
5. **Tag**: Create git tag for release
6. **Deploy**: Follow deployment procedures

---

**Note**: This project uses AI-assisted development with Cursor. All architectural decisions and final code quality are ensured through human oversight and review.
