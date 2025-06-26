'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Settings, Key, MessageSquare } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'ai'
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [currentAiMessage, setCurrentAiMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentAiMessage])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setCurrentAiMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: inputMessage,
          api_key: apiKey,
          model: 'gpt-4.1-mini'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let aiResponse = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        aiResponse += chunk
        setCurrentAiMessage(aiResponse)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setCurrentAiMessage('')

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        role: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Chat Application
          </h1>
          <p className="text-gray-600">
            Powered by OpenAI GPT-4.1-mini
          </p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  System Message
                </label>
                <textarea
                  value={developerMessage}
                  onChange={(e) => setDeveloperMessage(e.target.value)}
                  placeholder="Define the AI's behavior and role..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Chat</h2>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-primary-200 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto chat-container p-6">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation by typing a message below</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${
                      message.role === 'user' ? 'user-message' : 'ai-message'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-primary-100 mt-1 flex-shrink-0" />
                      ) : (
                        <Bot className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Current AI response */}
                {isLoading && currentAiMessage && (
                  <div className="chat-message ai-message">
                    <div className="flex items-start gap-3">
                      <Bot className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{currentAiMessage}</p>
                        <div className="typing-indicator mt-2">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  rows={1}
                  className="input-field resize-none"
                  disabled={isLoading || !apiKey.trim()}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim() || !apiKey.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
            
            {!apiKey.trim() && (
              <p className="text-sm text-red-600 mt-2">
                Please enter your OpenAI API key in settings to start chatting
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with Next.js, Tailwind CSS, and OpenAI API</p>
        </div>
      </div>
    </div>
  )
} 