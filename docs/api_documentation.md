# API Documentation

The RAG Knowledge Assistant backend is built with FastAPI. All endpoints are prefixed with `/api` when routed through the Nginx proxy, but the raw FastAPI app exposes them at the root.

## Base URL
`/api`

## Authentication
Most endpoints require a JWT token in the `Authorization` header.
`Authorization: Bearer <token>`

---

## 1. Authentication Endpoints

### Login
`POST /auth/token`

Authenticates a user and returns a JWT token. This uses OAuth2 password bearer format.

**Request Body (FormData):**
- `username` (string): The user's username
- `password` (string): The user's password

**Response:**
```json
{
  "access_token": "ey...",
  "token_type": "bearer",
  "user": {
    "username": "admin1",
    "role": "admin"
  }
}
```

---

## 2. Document Management Endpoints

### Upload Document
`POST /documents/upload`

Uploads a document, parses it, chunks it, embeds it, and stores it in the vector DB. Requires `admin` or `analyst` role.

**Request Body (Multipart Form):**
- `file`: The file to upload (PDF or DOCX).
- `access_level`: Required access level (`all`, `analyst`, or `admin`).

**Response:**
```json
{
  "message": "File 'security_policy.pdf' successfully processed and ingested.",
  "chunks": 42
}
```

### List Documents
`GET /documents/`

Returns a list of all ingested documents.

**Response:**
```json
{
  "documents": [
    {
      "filename": "security_policy.pdf",
      "access_level": "admin",
      "upload_time": "2024-05-10T14:30:00Z"
    }
  ]
}
```

### Delete Document
`DELETE /documents/{filename}`

Deletes a document from the filesystem and removes its chunks from the vector database.

**Response:**
```json
{
  "message": "Document security_policy.pdf successfully deleted."
}
```

---

## 3. Query Endpoints

### Ask Question
`POST /chat/query`

Queries the knowledge base. The system automatically filters retrieved context based on the authenticated user's role.

**Request Body (JSON):**
```json
{
  "query": "What is the new employee onboarding process?"
}
```

**Response:**
```json
{
  "answer": "The onboarding process includes setting up your workstation, completing the IT security training, and attending the orientation session. (Source: onboarding_guide.docx)",
  "sources": [
    {
      "source": "onboarding_guide.docx",
      "content": "New employee onboarding process: 1. Workstation setup... 2. IT security training... 3. Orientation..."
    }
  ]
}
```
