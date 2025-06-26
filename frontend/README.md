# AI Chat Frontend

A modern, responsive chat interface built with Next.js, Tailwind CSS, and designed to work with the FastAPI backend.

## Features

- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 🔐 **Secure API Key Management**: Password-style input for OpenAI API keys
- ⚙️ **Customizable System Messages**: Configure the AI's behavior and role
- 📱 **Real-time Streaming**: See AI responses as they're generated
- 🎯 **User-friendly**: Intuitive chat interface with typing indicators
- 🔄 **Auto-scroll**: Automatically scrolls to new messages
- ⌨️ **Keyboard Shortcuts**: Press Enter to send messages

## Prerequisites

Before running the frontend, make sure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **Backend Running** - The FastAPI backend should be running on `http://localhost:8000`

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to `http://localhost:3000`

3. **Configure your settings:**
   - Click the settings icon (⚙️) in the top-right corner
   - Enter your OpenAI API key
   - Optionally customize the system message
   - Close the settings panel

4. **Start chatting!**
   - Type your message in the input field
   - Press Enter or click Send
   - Watch the AI respond in real-time

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main chat interface
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## API Integration

The frontend communicates with the FastAPI backend through:

- **Chat Endpoint**: `POST /api/chat`
- **Health Check**: `GET /api/health`

The backend should be running on `http://localhost:8000` for local development.

## Deployment

This frontend is designed to be deployed on Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts** to connect your repository and deploy

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Run `npm install` to install dependencies
2. **API connection errors**: Ensure the backend is running on port 8000
3. **TypeScript errors**: These are expected before running `npm install`

### Getting Help

If you encounter any issues:
1. Check that all dependencies are installed
2. Verify the backend is running
3. Check the browser console for error messages
4. Ensure your OpenAI API key is valid

## Technologies Used

- **Next.js 14** - React framework with app router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **OpenAI API** - AI chat capabilities