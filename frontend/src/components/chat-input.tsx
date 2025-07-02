import { useState } from 'react'
import { Send, Settings, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (userMessage: string, developerMessage: string, apiKey: string) => void
  isLoading: boolean
  chatMode: 'regular' | 'rag'
  hasDocuments: boolean
}

export function ChatInput({ onSendMessage, isLoading, chatMode, hasDocuments }: ChatInputProps) {
  const [userMessage, setUserMessage] = useState('')
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.')
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim() || !apiKey.trim()) return
    
    // For RAG mode, we don't need a developer message, so we pass an empty string
    const devMessage = chatMode === 'rag' ? '' : developerMessage
    onSendMessage(userMessage, devMessage, apiKey)
    setUserMessage('')
  }

  const isDisabled = isLoading || !apiKey.trim() || (chatMode === 'rag' && !hasDocuments)

  return (
    <div className="border-t bg-white p-4">
      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {chatMode === 'regular' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Developer Message (System Prompt)
                </label>
                <textarea
                  value={developerMessage}
                  onChange={(e) => setDeveloperMessage(e.target.value)}
                  placeholder="You are a helpful AI assistant."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "p-2 rounded-md transition-colors",
            showSettings ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder={chatMode === 'rag' ? "Ask about your PDF..." : "Type your message..."}
          disabled={isDisabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        <button
          type="submit"
          disabled={isDisabled || !userMessage.trim()}
          className={cn(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",
            isLoading && "animate-pulse"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      {/* Status Messages */}
      {!apiKey.trim() && (
        <p className="text-sm text-red-500 mt-2">
          Please enter your OpenAI API key in settings to start chatting.
        </p>
      )}
      
      {chatMode === 'rag' && !hasDocuments && apiKey.trim() && (
        <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
          <FileText className="w-4 h-4" />
          Please upload a PDF document to start chatting with it.
        </p>
      )}
    </div>
  )
} 