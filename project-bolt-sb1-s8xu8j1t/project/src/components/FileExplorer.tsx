import React, { useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Search, Plus, MoreHorizontal } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  extension?: string;
}

interface FileExplorerProps {
  onFileSelect: (file: FileItem) => void;
}

const initialFiles: FileItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          { id: '3', name: 'App.tsx', type: 'file', extension: 'tsx' },
          { id: '4', name: 'Editor.tsx', type: 'file', extension: 'tsx' },
          { id: '5', name: 'FileExplorer.tsx', type: 'file', extension: 'tsx' },
        ]
      },
      { id: '6', name: 'main.tsx', type: 'file', extension: 'tsx' },
      { id: '7', name: 'index.css', type: 'file', extension: 'css' },
    ]
  },
  {
    id: '8',
    name: 'public',
    type: 'folder',
    children: [
      { id: '9', name: 'favicon.ico', type: 'file', extension: 'ico' },
    ]
  },
  { id: '10', name: 'package.json', type: 'file', extension: 'json' },
  { id: '11', name: 'tsconfig.json', type: 'file', extension: 'json' },
  { id: '12', name: 'README.md', type: 'file', extension: 'md' },
];

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']));
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'file') {
      onFileSelect(file);
    } else {
      toggleFolder(file.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? <FolderOpen size={16} className="text-yellow-400" /> : <Folder size={16} className="text-yellow-400" />;
    }
    
    // File icons based on extension
    switch (file.extension) {
      case 'tsx':
      case 'ts':
        return <File size={16} className="text-blue-400" />;
      case 'jsx':
      case 'js':
        return <File size={16} className="text-yellow-500" />;
      case 'css':
        return <File size={16} className="text-purple-400" />;
      case 'json':
        return <File size={16} className="text-yellow-300" />;
      case 'md':
        return <File size={16} className="text-gray-400" />;
      default:
        return <File size={16} className="text-gray-400" />;
    }
  };

  const renderFileTree = (fileItems: FileItem[], depth = 0) => {
    return fileItems
      .filter(file => 
        searchTerm === '' || 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.type === 'folder' && file.children?.some(child => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
      .map(file => (
        <React.Fragment key={file.id}>
          <div 
            className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer text-sm ${depth > 0 ? 'ml-4' : ''}`}
            onClick={() => handleFileClick(file)}
            onContextMenu={(e) => handleContextMenu(e, file.id)}
          >
            <span className="mr-1">
              {file.type === 'folder' ? 
                (expandedFolders.has(file.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : 
                <span className="w-3.5"></span>
              }
            </span>
            <span className="mr-1">{getFileIcon(file)}</span>
            <span className="truncate">{file.name}</span>
          </div>
          
          {file.type === 'folder' && expandedFolders.has(file.id) && file.children && 
            renderFileTree(file.children, depth + 1)
          }
        </React.Fragment>
      ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-gray-300 border-r border-gray-700">
      <div className="p-2 font-medium text-sm border-b border-gray-700 flex justify-between items-center">
        <span>EXPLORER</span>
        <button className="p-1 hover:bg-gray-700 rounded">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <div className="p-2 border-b border-gray-700">
        <div className="flex items-center bg-gray-700 rounded px-2">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search files"
            className="bg-transparent border-none w-full py-1 px-2 text-sm focus:outline-none text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between p-2 text-xs text-gray-400 font-medium">
        <span>FILES</span>
        <button className="p-1 hover:bg-gray-700 rounded">
          <Plus size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {renderFileTree(files)}
      </div>
      
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={closeContextMenu}
          />
          <div 
            className="absolute z-50 bg-gray-800 border border-gray-700 rounded shadow-lg py-1"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button className="w-full text-left px-3 py-1 text-sm hover:bg-gray-700">New File</button>
            <button className="w-full text-left px-3 py-1 text-sm hover:bg-gray-700">New Folder</button>
            <div className="border-t border-gray-700 my-1"></div>
            <button className="w-full text-left px-3 py-1 text-sm hover:bg-gray-700">Rename</button>
            <button className="w-full text-left px-3 py-1 text-sm hover:bg-gray-700 text-red-400">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileExplorer;