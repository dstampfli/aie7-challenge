import os
import tempfile
import uuid
from typing import List, Dict, Optional
import sys

# Add the aimakerspace library to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from aimakerspace.text_utils import PDFLoader, CharacterTextSplitter
from aimakerspace.vectordatabase import VectorDatabase
from aimakerspace.openai_utils.embedding import EmbeddingModel
from aimakerspace.openai_utils.chatmodel import ChatOpenAI


class RAGService:
    def __init__(self):
        """Initialize the RAG service with vector database and chat model."""
        self.embedding_model = EmbeddingModel()
        self.vector_db = VectorDatabase(self.embedding_model)
        self.chat_model = ChatOpenAI()
        self.documents: Dict[str, str] = {}  # Store document chunks with IDs
        self.document_metadata: Dict[str, Dict] = {}  # Store metadata for each document
        
    async def process_pdf(self, pdf_file_path: str, filename: str) -> str:
        """
        Process a PDF file and add it to the vector database.
        
        Args:
            pdf_file_path: Path to the uploaded PDF file
            filename: Original filename
            
        Returns:
            Document ID for the processed PDF
        """
        try:
            # Load and extract text from PDF
            pdf_loader = PDFLoader(pdf_file_path)
            documents = pdf_loader.load_documents()
            
            if not documents:
                raise ValueError("No text could be extracted from the PDF")
            
            # Split text into chunks
            splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunks = splitter.split_texts(documents)
            
            # Generate unique document ID
            doc_id = str(uuid.uuid4())
            
            # Store chunks with metadata
            chunk_ids = []
            for i, chunk in enumerate(chunks):
                chunk_id = f"{doc_id}_chunk_{i}"
                chunk_ids.append(chunk_id)
                self.documents[chunk_id] = chunk
            
            # Store document metadata
            self.document_metadata[doc_id] = {
                "filename": filename,
                "chunk_count": len(chunks),
                "chunk_ids": chunk_ids,
                "total_chunks": len(chunks)
            }
            
            # Add chunks to vector database
            await self.vector_db.abuild_from_list(chunks)
            
            return doc_id
            
        except Exception as e:
            raise Exception(f"Error processing PDF: {str(e)}")
    
    async def chat_with_document(self, user_message: str, api_key: str, model: str = "gpt-4o-mini") -> str:
        """
        Chat with the uploaded documents using RAG.
        
        Args:
            user_message: User's question
            api_key: OpenAI API key
            model: Model to use for chat
            
        Returns:
            AI response based on document content
        """
        try:
            # Search for relevant chunks
            search_results = self.vector_db.search_by_text(
                user_message, 
                k=3, 
                return_as_text=False
            )
            
            if not search_results:
                return "I don't have any relevant information from the uploaded documents to answer your question. Please make sure you've uploaded a PDF document first."
            
            # Extract text from search results (they are tuples of (text, score))
            relevant_chunks = [result[0] for result in search_results]
            
            # Create context from relevant chunks
            context = "\n\n".join(relevant_chunks)
            
            # Create system message with context
            system_message = f"""You are a helpful assistant that answers questions based on the following document content. 
            Only use the information provided in the context to answer questions. If the answer cannot be found in the context, 
            say so clearly. Here is the relevant context from the uploaded document:

            {context}
            
            Please answer the user's question based on this context."""
            
            # Create messages for the chat model
            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ]
            
            # Get response from chat model
            response = self.chat_model.run(messages, text_only=True)
            
            return response
            
        except Exception as e:
            raise Exception(f"Error in RAG chat: {str(e)}")
    
    def get_document_info(self) -> List[Dict]:
        """Get information about uploaded documents."""
        return [
            {
                "id": doc_id,
                "filename": metadata["filename"],
                "chunk_count": metadata["chunk_count"]
            }
            for doc_id, metadata in self.document_metadata.items()
        ]
    
    def has_documents(self) -> bool:
        """Check if any documents have been uploaded."""
        return len(self.document_metadata) > 0


# Global RAG service instance
rag_service = RAGService() 