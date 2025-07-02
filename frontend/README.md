# AI Chat Assistant Frontend

A modern, responsive chat interface built with Next.js, TypeScript, and Tailwind CSS that integrates with the FastAPI backend to provide a seamless AI chat experience.

## 🚀 Features

- **Real-time Streaming**: Experience AI responses as they're generated with streaming support
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support for better development experience
- **Customizable System Prompts**: Configure the AI's behavior with developer messages
- **Secure API Key Management**: Client-side API key handling with password fields
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Integration**: Fetch API with streaming support

## 📋 Prerequisites

Before running the frontend, ensure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn**
3. **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **Backend Running** - The FastAPI backend should be running on `http://localhost:8000`

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Create a `.env.local` file in the frontend directory to customize the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, the frontend will default to `http://localhost:8000`.

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🎯 Usage

### First Time Setup

1. **Open the Application**: Navigate to `http://localhost:3000`
2. **Configure Settings**: Click the settings icon (⚙️) in the input area
3. **Enter API Key**: Add your OpenAI API key in the settings panel
4. **Customize System Prompt**: Optionally modify the developer message to change AI behavior
5. **Start Chatting**: Begin your conversation with the AI!

### Features Overview

- **Settings Panel**: Toggle with the settings icon to configure API key and system prompts
- **Real-time Responses**: Watch as the AI generates responses in real-time
- **Message History**: View your conversation history in the chat interface
- **Error Handling**: Clear error messages for API issues or network problems
- **Responsive Design**: Works on all device sizes

## 🔧 Configuration

### API Key Management

The application stores your OpenAI API key locally in the browser. It's never sent to any server except OpenAI's API.

### System Prompts

You can customize the AI's behavior by modifying the "Developer Message" in settings. This acts as the system prompt that defines the AI's role and behavior.

### Backend Integration

The frontend communicates with the FastAPI backend at `/api/chat` for streaming responses and `/api/health` for health checks.

## 🐛 Troubleshooting

### Common Issues

1. **"Please enter your OpenAI API key"**
   - Open settings and add your valid OpenAI API key

2. **"HTTP error! status: 500"**
   - Ensure the FastAPI backend is running on port 8000
   - Check that your API key is valid and has sufficient credits

3. **CORS Errors**
   - The backend should have CORS configured to allow requests from `http://localhost:3000`

4. **Streaming Not Working**
   - Ensure your browser supports the Fetch API with streaming
   - Check that the backend is properly configured for streaming responses

### Development Tips

- Use browser developer tools to inspect network requests
- Check the console for any JavaScript errors
- Verify the backend health endpoint is responding

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── page.tsx
│   │   └── components/
│   │       └── chat-interface.tsx
│   ├── components/          # React components
│   │   ├── chat-interface.tsx
│   │   ├── chat-input.tsx
│   │   └── chat-message.tsx
│   ├── lib/                 # Utility functions and API client
│   │   ├── api.ts
│   │   └── utils.ts
│   └── types/               # TypeScript type definitions
│       └── chat.ts
├── public/                  # Static assets
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the AI Engineer Challenge and follows the same licensing terms.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the backend logs for API errors
3. Ensure all prerequisites are met
4. Check that your OpenAI API key is valid and has sufficient credits
