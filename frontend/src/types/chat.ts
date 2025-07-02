export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'developer'
  content: string
  timestamp: Date
}

export interface ChatRequest {
  developer_message: string
  user_message: string
  model?: string
  api_key: string
}

export interface RAGChatRequest {
  user_message: string
  model?: string
  api_key: string
}

export interface ChatResponse {
  content: string
  error?: string
}

export interface DocumentInfo {
  id: string
  filename: string
  chunk_count: number
}

export interface UploadResponse {
  message: string
  document_id: string
  filename: string
} 