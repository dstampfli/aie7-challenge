'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage as ChatMessageType } from '@/types/chat'
import { sendChatMessage, sendRAGChatMessage } from '@/lib/api'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { PDFUpload } from './pdf-upload'
import { Bot, AlertCircle, FileText, MessageSquare } from 'lucide-react'

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasDocuments, setHasDocuments] = useState(false)
  const [chatMode, setChatMode] = useState<'regular' | 'rag'>('regular')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (userMessage: string, developerMessage: string, apiKey: string) => {
    setIsLoading(true)
    setError(null)

    // Add user message to chat
    const userChatMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userChatMessage])

    // Add developer message to chat (only for regular mode)
    if (chatMode === 'regular') {
      const developerChatMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'developer',
        content: developerMessage,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, developerChatMessage])
    }

    try {
      // Create assistant message placeholder
      const assistantMessageId = (Date.now() + 2).toString()
      const assistantChatMessage: ChatMessageType = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantChatMessage])

      // Get streaming response based on chat mode
      const stream = chatMode === 'rag' 
        ? await sendRAGChatMessage({
            user_message: userMessage,
            api_key: apiKey,
          })
        : await sendChatMessage({
            developer_message: developerMessage,
            user_message: userMessage,
            api_key: apiKey,
          })

      const reader = stream.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Remove the assistant message if there was an error
      setMessages(prev => prev.filter(msg => msg.role !== 'assistant' || msg.content !== ''))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentUploaded = () => {
    setHasDocuments(true)
    if (chatMode === 'regular') {
      setChatMode('rag')
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Chat Assistant</h1>
              <p className="text-sm text-gray-500">
                {chatMode === 'rag' ? 'Chat with your PDF documents' : 'Powered by OpenAI GPT-4.1-mini'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Chat Mode Toggle */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setChatMode('regular')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              chatMode === 'regular'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Regular Chat</span>
          </button>
          <button
            onClick={() => setChatMode('rag')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              chatMode === 'rag'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">PDF Chat</span>
          </button>
        </div>
      </div>

      {/* PDF Upload Section (only for RAG mode) */}
      {chatMode === 'rag' && (
        <div className="px-6 py-4">
          <PDFUpload onDocumentUploaded={handleDocumentUploaded} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {chatMode === 'rag' ? 'Upload a PDF to start chatting' : 'Welcome to AI Chat'}
              </h3>
              <p className="text-gray-500">
                {chatMode === 'rag' 
                  ? 'Upload a PDF document above and ask questions about its content.'
                  : 'Start a conversation by typing a message below.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-t border-red-200 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        chatMode={chatMode}
        hasDocuments={hasDocuments}
      />
    </div>
  )
} 