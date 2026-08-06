# Known Limitations & Future Improvements

## Current Limitations

1. **In-Memory / Local Storage:**
   - ChromaDB uses a local persistence directory. This prevents horizontally scaling the backend application across multiple containers, as they would not share the same vector index.
   - Uploaded files are saved to the local container disk.

2. **Hardcoded User Database:**
   - Users and roles are hardcoded into the application logic for demonstration purposes. There is no database for user management, password hashing, or registration.

3. **Synchronous LLM Calls & No Streaming:**
   - Chat responses wait for the full generation to complete before sending the response back to the client. There is no server-sent events (SSE) or WebSocket implementation for streaming tokens.

4. **Basic RAG Pipeline:**
   - Uses a standard chunking strategy with fixed sizes.
   - No hybrid search (keyword + vector).
   - No re-ranking of retrieved documents.
   - Conversation history is not maintained (stateless Q&A).

5. **Supported File Formats:**
   - Only PDF and DOCX files are currently supported. Plain text, CSV, HTML, and image (OCR) support is missing.

## Future Improvements

1. **Infrastructure Upgrades:**
   - Migrate to a managed Vector Database (e.g., Pinecone, Qdrant Cloud, or a dedicated Chroma/Weaviate cluster).
   - Store documents in an S3-compatible object store.
   - Introduce a relational database (PostgreSQL) for user management and chat history.

2. **Advanced RAG Features:**
   - **Hybrid Search**: Combine BM25 keyword search with vector search for better retrieval precision.
   - **Re-ranking**: Introduce a cross-encoder model to re-rank the top K results before feeding them to the LLM.
   - **Semantic Chunking**: Split documents based on structural boundaries (headers, paragraphs) rather than raw character counts.
   - **Agentic Routing**: Determine if a question requires a standard RAG response, a web search, or a direct greeting, and route accordingly.

3. **User Experience Enhancements:**
   - Implement HTTP Streaming for the chat UI to show tokens as they are generated.
   - Add conversation sessions to retain chat history for follow-up questions.
   - Add citation highlighting (click a source to see the exact highlighted text in the document viewer).

4. **Security & Auth:**
   - Integrate with OIDC providers (Google Workspace, Okta, Microsoft Entra).
   - Implement refresh tokens.
