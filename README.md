# RAG Knowledge Assistant

An intelligent, full-stack Retrieval-Augmented Generation (RAG) system built with FastAPI, React, and Google's Gemini API. This application allows organizations to ingest documents, store them in a local vector database, and query them using an AI assistant that respects Role-Based Access Control (RBAC).

## Features

- **Document Ingestion**: Upload PDF and DOCX files. Automatic text extraction, chunking, and embedding.
- **RAG QA**: Ask questions and get answers synthesized directly from your documents.
- **Source Citations**: Answers include references to the specific documents used as context.
- **Role-Based Access Control (RBAC)**: Documents are tagged with access levels (`all`, `analyst`, `admin`). Users only receive answers derived from documents they are authorized to see.
- **Modern UI**: A responsive, clean React interface built with Tailwind CSS.

## Architecture

![Architecture](docs/architecture.md)

*For a detailed overview of the system design and data flow, see the [Architecture Documentation](docs/architecture.md).*

## Screenshots

> *(Placeholder for UI screenshots: Login screen, Chat Interface, Document Management)*

## Prerequisites

- Docker and Docker Compose (Recommended)
- OR Local setup requirements:
  - Python 3.11+
  - Node.js 20+
  - A Google Gemini API Key

## Quick Start (Local Development)

### 1. Clone & Configure

```bash
# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite specifies).

## Docker Setup

The easiest way to run the entire stack:

```bash
# Ensure .env is configured with your API key
docker-compose up --build -d
```

- Web Interface: `http://localhost:3000`
- API Backend: `http://localhost:8000/docs` (Swagger UI)

## Default Credentials

The system uses a hardcoded demo authentication system. Use these credentials to test RBAC:

| Username | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `admin1` | `adminpass` | **Admin** | Full access (`all`, `analyst`, `admin`) |
| `analyst1` | `analystpass` | **Analyst** | Partial access (`all`, `analyst`) |
| `viewer1` | `viewerpass` | **Viewer** | Basic access (`all`) |

## Sample Documents

The project includes a script to generate 18 realistic sample documents across different access tiers to demonstrate the system's capabilities.

```bash
cd sample_documents
pip install -r requirements.txt
python generate_samples.py
```

This will create PDFs and DOCX files in the `sample_documents` directory. You can upload these via the UI or API. See the [Test Questions](sample_documents/test_questions.md) document to verify system performance.

## Documentation

- [Architecture & Design](docs/architecture.md)
- [API Reference](docs/api_documentation.md)
- [Known Limitations & Future Work](docs/known_limitations.md)

## Tech Stack

| Tier | Technologies |
| --- | --- |
| **Frontend** | React, Vite, Tailwind CSS, Axios, Lucide React |
| **Backend** | Python, FastAPI, PyJWT |
| **AI / RAG** | LangChain, PyPDF2, python-docx, ChromaDB |
| **Models** | Google Gemini (gemini-2.0-flash), Google Text Embeddings |
| **Infrastructure**| Docker, Docker Compose, Nginx |

## License

MIT
