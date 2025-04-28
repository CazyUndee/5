import React, { useState } from 'react';
import Split from 'react-split';
import Editor from './components/Editor';
import FileExplorer from './components/FileExplorer';
import ActivityBar from './components/ActivityBar';
import StatusBar from './components/StatusBar';
import Terminal from './components/Terminal';
import { Code } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
}

function App() {
  const [activeView, setActiveView] = useState('explorer');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [editorContent, setEditorContent] = useState<string>(`// Welcome to CodeCraft Studio
// A modern, feature-rich code editor

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(\`https://api.example.com/users/\${userId}\`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
        console.log('Error fetching user:', err);
      }
    }
    
    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => console.log('User profile viewed')}>
        Contact User
      </button>
    </div>
  );
}

export default UserProfile;
`);

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    
    if (file.extension === 'tsx' || file.extension === 'ts') {
      setEditorContent(editorContent);
    } else if (file.extension === 'css') {
      setEditorContent(`/* CSS styles for the application */

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.button {
  background-color: #0078d4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 2px;
  cursor: pointer;
}

.button:hover {
  background-color: #106ebe;
}
`);
    } else if (file.extension === 'json') {
      setEditorContent(`{
  "name": "codecraft-studio",
  "version": "1.0.0",
  "description": "A modern, feature-rich code editor",
  "main": "index.js",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`);
    } else if (file.extension === 'md') {
      setEditorContent(`# CodeCraft Studio

A modern, feature-rich code editor built with React and TypeScript.

## Features

- Syntax highlighting
- File explorer
- Terminal integration
- AI assistant
- Error detection
- Git integration
- Extensions marketplace

## Getting Started

1. Clone the repository
2. Install dependencies with \`npm install\`
3. Start the development server with \`npm start\`

## License

MIT
`);
    }
  };

  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen);
  };

  const toggleTerminalMaximize = () => {
    setIsTerminalMaximized(!isTerminalMaximized);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header/Title Bar */}
      <div className="h-9 bg-gray-900 flex items-center px-4 border-b border-gray-800">
        <div className="flex items-center flex-1">
          <Code size={20} className="text-blue-500 mr-2" />
          <span className="font-medium mr-8">CodeCraft Studio</span>
          <div className="flex space-x-4 text-sm">
            <button className="hover:text-blue-400">File</button>
            <button className="hover:text-blue-400">Edit</button>
            <button className="hover:text-blue-400">View</button>
            <button className="hover:text-blue-400">Run</button>
            <button className="hover:text-blue-400">Terminal</button>
            <button className="hover:text-blue-400">Help</button>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className="hover:bg-gray-700 px-2 py-1 rounded text-sm"
            onClick={toggleTerminal}
          >
            Terminal
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <Split
        className="flex-1 flex overflow-hidden"
        sizes={[20, 80]}
        minSize={[200, 400]}
        gutterSize={4}
        gutterStyle={() => ({
          backgroundColor: '#2d3748',
          cursor: 'col-resize',
        })}
      >
        {/* Activity Bar and Side Panel */}
        <div className="flex h-full">
          <ActivityBar activeView={activeView} onViewChange={setActiveView} />
          <div className="w-full h-full">
            {activeView === 'explorer' && (
              <FileExplorer onFileSelect={handleFileSelect} />
            )}
            {activeView === 'search' && (
              <div className="h-full bg-gray-800 p-4 text-gray-300">
                <h3 className="text-sm font-medium mb-2">Search</h3>
                <input 
                  type="text" 
                  placeholder="Search in files" 
                  className="w-full bg-gray-700 text-white px-3 py-1 rounded text-sm"
                />
                <div className="mt-4 text-sm text-gray-400">
                  No results found
                </div>
              </div>
            )}
            {activeView === 'git' && (
              <div className="h-full bg-gray-800 p-4 text-gray-300">
                <h3 className="text-sm font-medium mb-2">Source Control</h3>
                <div className="text-sm text-gray-400">
                  No changes detected
                </div>
              </div>
            )}
            {activeView === 'debug' && (
              <div className="h-full bg-gray-800 p-4 text-gray-300">
                <h3 className="text-sm font-medium mb-2">Run and Debug</h3>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm mt-2">
                  Start Debugging
                </button>
              </div>
            )}
            {activeView === 'extensions' && (
              <div className="h-full bg-gray-800 p-4 text-gray-300">
                <h3 className="text-sm font-medium mb-2">Extensions</h3>
                <input 
                  type="text" 
                  placeholder="Search extensions" 
                  className="w-full bg-gray-700 text-white px-3 py-1 rounded text-sm mb-4"
                />
                <div className="space-y-2">
                  <div className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">CodeCraft AI Assistant</div>
                        <div className="text-xs text-gray-400">v1.2.0 • Installed</div>
                      </div>
                      <button className="px-2 py-1 text-xs bg-blue-600 rounded hover:bg-blue-700">
                        Configure
                      </button>
                    </div>
                    <p className="text-sm mt-2 text-gray-300">
                      AI-powered code completion and suggestions
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Git History</div>
                        <div className="text-xs text-gray-400">v2.1.3</div>
                      </div>
                      <button className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700">
                        Install
                      </button>
                    </div>
                    <p className="text-sm mt-2 text-gray-300">
                      View and search git log along with graph and details
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Theme: Night Owl</div>
                        <div className="text-xs text-gray-400">v3.0.1</div>
                      </div>
                      <button className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700">
                        Install
                      </button>
                    </div>
                    <p className="text-sm mt-2 text-gray-300">
                      A dark theme optimized for night coding
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Live Preview</div>
                        <div className="text-xs text-gray-400">v1.0.5</div>
                      </div>
                      <button className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700">
                        Install
                      </button>
                    </div>
                    <p className="text-sm mt-2 text-gray-300">
                      Live preview for HTML/CSS/JS files
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="flex items-center h-9">
              {selectedFile ? (
                <div className="px-4 py-1 bg-gray-900 text-white flex items-center border-r border-gray-700">
                  {selectedFile.name}
                  <button className="ml-2 text-gray-400 hover:text-white">×</button>
                </div>
              ) : (
                <div className="px-4 py-1 bg-gray-900 text-white flex items-center border-r border-gray-700">
                  welcome.tsx
                  <button className="ml-2 text-gray-400 hover:text-white">×</button>
                </div>
              )}
            </div>
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 overflow-hidden">
            <Editor 
              initialValue={editorContent}
              onCodeChange={setEditorContent}
            />
          </div>
          
          {/* Terminal */}
          {isTerminalOpen && (
            <Terminal 
              isOpen={isTerminalOpen}
              onClose={toggleTerminal}
              onToggleMaximize={toggleTerminalMaximize}
              isMaximized={isTerminalMaximized}
            />
          )}
        </div>
      </Split>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}

export default App;