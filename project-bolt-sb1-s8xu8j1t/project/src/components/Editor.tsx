import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { Maximize2, Minimize2, Play, Save, Settings, Terminal, Zap } from 'lucide-react';
import * as themes from 'monaco-themes/themes/themelist.json';

interface EditorProps {
  initialValue?: string;
  language?: string;
  theme?: string;
  onCodeChange?: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  initialValue = '// Start coding here...',
  language = 'typescript',
  theme = 'vs-dark',
  onCodeChange,
}) => {
  const [code, setCode] = useState(initialValue);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState<editor.IMarkerData[]>([]);
  const [currentTheme, setCurrentTheme] = useState('vs-dark');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load and define themes
    Object.entries(themes).forEach(([themeId, themePath]) => {
      fetch(`https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/${themePath}.json`)
        .then(data => data.json())
        .then(themeData => {
          monacoRef.current?.editor.defineTheme(themeId, themeData);
        });
    });
  }, []);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Add custom validation
    setTimeout(() => {
      validateCode(code);
    }, 1000);
  };

  const validateCode = (value: string) => {
    if (!monacoRef.current) return;
    
    const newMarkers: editor.IMarkerData[] = [];
    
    // Simple validation example - detect missing semicolons
    const lines = value.split('\n');
    lines.forEach((line, i) => {
      if (line.trim() && !line.trim().endsWith(';') && 
          !line.trim().endsWith('{') && 
          !line.trim().endsWith('}') && 
          !line.trim().startsWith('//') &&
          !line.trim().startsWith('import') &&
          !line.trim().startsWith('export') &&
          !line.includes('function') &&
          !line.includes('=>')) {
        newMarkers.push({
          severity: monacoRef.current.MarkerSeverity.Warning,
          message: 'Missing semicolon',
          startLineNumber: i + 1,
          startColumn: 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1,
        });
      }
      
      // Check for console.log statements
      if (line.includes('console.log')) {
        newMarkers.push({
          severity: monacoRef.current.MarkerSeverity.Info,
          message: 'Consider removing console.log before production',
          startLineNumber: i + 1,
          startColumn: line.indexOf('console.log'),
          endLineNumber: i + 1,
          endColumn: line.indexOf('console.log') + 'console.log'.length,
        });
      }
    });
    
    setMarkers(newMarkers);
    
    if (monacoRef.current) {
      monacoRef.current.editor.setModelMarkers(
        editorRef.current?.getModel(),
        'owner',
        newMarkers
      );
    }
  };

  const handleCodeChange = (value: string = '') => {
    setCode(value);
    if (onCodeChange) {
      onCodeChange(value);
    }
    validateCode(value);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (editorRef.current) {
      setTimeout(() => {
        editorRef.current?.layout();
      }, 100);
    }
  };

  const toggleAiPanel = () => {
    setIsAiPanelOpen(!isAiPanelOpen);
    if (editorRef.current) {
      setTimeout(() => {
        editorRef.current?.layout();
      }, 100);
    }
  };

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    monacoRef.current?.editor.setTheme(themeName);
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Try using a more functional approach with map() instead of the for loop.",
        "Consider adding type annotations to improve code safety.",
        "You could refactor this into smaller, more focused functions.",
        "This algorithm could be optimized by using a Set instead of an Array for lookups."
      ];
      
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsLoading(false);
    }, 1500);
  };

  const handleRunCode = () => {
    try {
      // This is just a simulation - in a real app you'd need a safer evaluation method
      // eslint-disable-next-line no-new-func
      const result = new Function(`
        try {
          ${code}
          return "Code executed successfully!";
        } catch (error) {
          return "Error: " + error.message;
        }
      `)();
      
      alert(result);
    } catch (error) {
      alert(`Failed to execute: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSaveCode = () => {
    // In a real app, this would save to a file or database
    localStorage.setItem('savedCode', code);
    alert('Code saved successfully!');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCode();
      }
      
      // Ctrl+Enter or Cmd+Enter to run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);

  return (
    <div 
      ref={editorContainerRef}
      className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'relative w-full h-full'}`}
    >
      <div className="flex items-center justify-between bg-gray-800 text-white p-3 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            onClick={handleRunCode}
            title="Run Code (Ctrl+Enter)"
          >
            <Play size={20} />
          </button>
          <button 
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            onClick={handleSaveCode}
            title="Save Code (Ctrl+S)"
          >
            <Save size={20} />
          </button>
          <button 
            className={`p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 ${isAiPanelOpen ? 'text-blue-400' : ''}`}
            onClick={toggleAiPanel}
            title="AI Assistant"
          >
            <Zap size={20} />
          </button>
          <div className="h-6 w-px bg-gray-700 mx-2" />
          <select 
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-gray-600"
            value={currentTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <option value="vs-dark">Dark Theme</option>
            <option value="vs-light">Light Theme</option>
            <option value="monokai">Monokai</option>
            <option value="github-dark">GitHub Dark</option>
            <option value="night-owl">Night Owl</option>
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-gray-600"
            value={language}
            onChange={(e) => {
              if (onCodeChange) {
                onCodeChange(code);
              }
            }}
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
          <button 
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${isAiPanelOpen ? 'w-2/3' : 'w-full'}`}>
          <MonacoEditor
            height="100%"
            language={language}
            theme={currentTheme}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              lineNumbers: 'on',
              tabSize: 2,
              formatOnPaste: true,
              formatOnType: true,
              smoothScrolling: true,
              cursorSmoothCaretAnimation: true,
              cursorBlinking: 'smooth',
              renderWhitespace: 'selection',
              bracketPairColorization: {
                enabled: true,
              },
            }}
          />
        </div>
        
        {isAiPanelOpen && (
          <div className="w-1/3 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 bg-gray-900 text-white font-medium border-b border-gray-700 flex items-center justify-between">
              <span>AI Assistant</span>
              <button 
                onClick={toggleAiPanel}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 text-white">
              {aiResponse && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm">{aiResponse}</p>
                </div>
              )}
            </div>
            <form onSubmit={handleAiSubmit} className="p-4 border-t border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI for help..."
                  className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {isLoading ? "..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 border-t border-gray-700 flex justify-between">
        <div>
          {markers.length > 0 ? (
            <span className="text-yellow-400">
              {markers.length} {markers.length === 1 ? 'issue' : 'issues'} found
            </span>
          ) : (
            <span className="text-green-400">No issues detected</span>
          )}
        </div>
        <div>
          Ln {editorRef.current?.getPosition()?.lineNumber || 1}, 
          Col {editorRef.current?.getPosition()?.column || 1}
        </div>
      </div>
    </div>
  );
};

export default Editor;