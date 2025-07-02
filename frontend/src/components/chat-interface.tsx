'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage as ChatMessageType } from '@/types/chat'
import { sendChatMessage } from '@/lib/api'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { Bot, AlertCircle } from 'lucide-react'

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

    // Add developer message to chat (optional, for context)
    const developerChatMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'developer',
      content: developerMessage,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, developerChatMessage])

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

      // Get streaming response
      const stream = await sendChatMessage({
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Chat Assistant</h1>
            <p className="text-sm text-gray-500">Powered by OpenAI GPT-4.1-mini</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to AI Chat</h3>
              <p className="text-gray-500">Start a conversation by typing a message below.</p>
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
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
} 