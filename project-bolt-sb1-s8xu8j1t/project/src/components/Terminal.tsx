import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, ChevronRight } from 'lucide-react';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMaximize: () => void;
  isMaximized: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ 
  isOpen, 
  onClose, 
  onToggleMaximize, 
  isMaximized 
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome to VS Code Terminal',
    'Type "help" for available commands',
    ''
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory(1);
    }
  };
  
  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return;
    
    const newIndex = historyIndex + direction;
    if (newIndex >= -1 && newIndex < commandHistory.length) {
      setHistoryIndex(newIndex);
      if (newIndex === -1) {
        setInput('');
      } else {
        setInput(commandHistory[newIndex]);
      }
    }
  };
  
  const handleCommand = () => {
    if (!input.trim()) return;
    
    const newHistory = [...history, `$ ${input}`];
    
    // Process command
    const command = input.trim().toLowerCase();
    let response = '';
    
    switch (command) {
      case 'help':
        response = `Available commands:
  help - Show this help message
  clear - Clear the terminal
  echo [text] - Display text
  ls - List files
  pwd - Print working directory
  date - Show current date and time
  version - Show version information`;
        break;
      case 'clear':
        setHistory(['']);
        setInput('');
        return;
      case 'ls':
        response = `src/
public/
package.json
tsconfig.json
README.md`;
        break;
      case 'pwd':
        response = '/home/project';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'version':
        response = 'VS Code v1.85.0\nNode.js v18.16.0\nTypeScript 5.5.3';
        break;
      default:
        if (command.startsWith('echo ')) {
          response = command.substring(5);
        } else {
          response = `Command not found: ${command}. Type "help" for available commands.`;
        }
    }
    
    setHistory([...newHistory, response, '']);
    
    // Update command history
    if (!commandHistory.includes(input)) {
      setCommandHistory([input, ...commandHistory].slice(0, 50));
    }
    setHistoryIndex(-1);
    setInput('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`bg-gray-900 border-t border-gray-700 text-white ${
        isMaximized ? 'fixed inset-0 z-40' : 'h-64'
      }`}
    >
      <div className="flex items-center justify-between bg-gray-800 px-4 py-1 border-b border-gray-700">
        <div className="text-sm font-medium">Terminal</div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-gray-700 rounded"
            onClick={onToggleMaximize}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            className="p-1 hover:bg-gray-700 rounded"
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="p-2 overflow-auto font-mono text-sm"
        style={{ height: 'calc(100% - 32px)' }}
      >
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        
        <div className="flex items-center">
          <ChevronRight size={14} className="text-green-500 mr-1" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;