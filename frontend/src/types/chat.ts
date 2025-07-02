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

export interface ChatResponse {
  content: string
  error?: string
} 