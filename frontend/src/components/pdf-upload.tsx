'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { uploadPDF, getDocuments } from '@/lib/api'
import { DocumentInfo } from '@/types/chat'

interface PDFUploadProps {
  onDocumentUploaded: () => void
}

export function PDFUpload({ onDocumentUploaded }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [documents, setDocuments] = useState<DocumentInfo[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please select a PDF file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const result = await uploadPDF(file)
      setUploadSuccess(`PDF "${result.filename}" uploaded successfully!`)
      onDocumentUploaded()
      loadDocuments()
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const loadDocuments = async () => {
    setIsLoadingDocuments(true)
    try {
      const docs = await getDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const clearMessages = () => {
    setUploadError(null)
    setUploadSuccess(null)
  }

  return (
    <div className="bg-white border rounded-lg p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">PDF Upload</h3>
      </div>

      {/* Upload Area */}
      <div className="mb-4">
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-1">
            {isUploading ? 'Uploading...' : 'Click to upload a PDF file'}
          </p>
          <p className="text-sm text-gray-500">Max size: 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Status Messages */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{uploadError}</span>
          <button
            onClick={clearMessages}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700 text-sm">{uploadSuccess}</span>
          <button
            onClick={clearMessages}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Uploaded Documents */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
        {isLoadingDocuments ? (
          <div className="text-sm text-gray-500">Loading documents...</div>
        ) : documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700 flex-1">{doc.filename}</span>
                <span className="text-xs text-gray-500">
                  {doc.chunk_count} chunks
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No documents uploaded yet</div>
        )}
      </div>
    </div>
  )
} 