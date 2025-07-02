# Merge Instructions for PDF Upload and RAG Functionality

This feature adds PDF upload and RAG (Retrieval-Augmented Generation) functionality to the application using the `aimakerspace` library.

## Changes Made

### Backend Changes
- **New Dependencies**: Added `PyPDF2` and `python-dotenv` to `api/requirements.txt`
- **RAG Service**: Created `api/rag_service.py` for PDF processing and vector storage
- **API Endpoints**: Added new endpoints in `api/app.py`:
  - `POST /api/upload-pdf` - Upload and process PDF files
  - `POST /api/rag-chat` - Chat with uploaded documents
  - `GET /api/documents` - Get list of uploaded documents

### Frontend Changes
- **New Types**: Added RAG-related types in `frontend/src/types/chat.ts`
- **API Functions**: Added PDF upload and RAG chat functions in `frontend/src/lib/api.ts`
- **PDF Upload Component**: Created `frontend/src/components/pdf-upload.tsx`
- **Enhanced Chat Interface**: Updated `frontend/src/components/chat-interface.tsx` with dual chat modes
- **Updated Chat Input**: Modified `frontend/src/components/chat-input.tsx` to support RAG mode

## Features Added

1. **PDF Upload**: Users can upload PDF files (max 10MB) through a drag-and-drop interface
2. **Document Processing**: PDFs are automatically processed, chunked, and indexed using vector embeddings
3. **Dual Chat Modes**: 
   - Regular Chat: Standard OpenAI chat functionality
   - PDF Chat: RAG-based chat using uploaded documents
4. **Document Management**: View uploaded documents and their processing status
5. **Streaming Responses**: Both chat modes support real-time streaming responses

## Merge Options

### Option 1: GitHub Pull Request (Recommended)

1. Push the feature branch to GitHub:
   ```bash
   git push origin feature/pdf-upload-rag
   ```

2. Create a Pull Request on GitHub:
   - Go to your repository on GitHub
   - Click "Compare & pull request" for the `feature/pdf-upload-rag` branch
   - Add a description of the changes
   - Review the changes and merge

### Option 2: GitHub CLI

1. Push the feature branch:
   ```bash
   git push origin feature/pdf-upload-rag
   ```

2. Create and merge the PR using GitHub CLI:
   ```bash
   gh pr create --title "Add PDF upload and RAG functionality" --body "This PR adds PDF upload and RAG functionality using the aimakerspace library. Features include:
   
   - PDF upload and processing
   - Vector-based document indexing
   - RAG chat with uploaded documents
   - Dual chat modes (regular and PDF)
   - Streaming responses
   - Document management interface"
   
   gh pr merge --merge
   ```

### Option 3: Direct Merge (if working locally)

1. Switch to main branch:
   ```bash
   git checkout main
   ```

2. Merge the feature branch:
   ```bash
   git merge feature/pdf-upload-rag
   ```

3. Push to remote:
   ```bash
   git push origin main
   ```

## Testing the Feature

After merging, test the functionality:

1. **Start the backend**:
   ```bash
   cd api
   pip install -r requirements.txt
   python app.py
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Test PDF Upload**:
   - Switch to "PDF Chat" mode
   - Upload a PDF file
   - Ask questions about the document content

4. **Test Regular Chat**:
   - Switch to "Regular Chat" mode
   - Enter your OpenAI API key
   - Start a conversation

## Environment Variables

Make sure to set the `OPENAI_API_KEY` environment variable for the backend to work properly.

## Notes

- The RAG system uses in-memory vector storage (resets on server restart)
- PDF processing includes text extraction and chunking with overlap
- The system supports multiple uploaded documents
- All responses are streamed for better user experience 