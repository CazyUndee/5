import React, { useState } from 'react';
import { Files, Search, GitBranch, Settings, Play, Zap } from 'lucide-react';

interface ActivityBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onViewChange }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const handleMouseEnter = (id: string) => {
    setShowTooltip(id);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(null);
  };
  
  const renderTooltip = (id: string, text: string) => {
    if (showTooltip !== id) return null;
    
    return (
      <div className="absolute left-16 top-0 z-10 px-3 py-1.5 text-xs bg-gray-800 text-white rounded shadow-lg whitespace-nowrap">
        {text}
      </div>
    );
  };
  
  return (
    <div className="h-full w-16 bg-gray-900 flex flex-col items-center py-4 border-r border-gray-800">
      <div className="flex flex-col space-y-6 items-center">
        <button
          className={`relative p-3 rounded-lg transition-colors duration-200 ${
            activeView === 'explorer' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => onViewChange('explorer')}
          onMouseEnter={() => handleMouseEnter('explorer')}
          onMouseLeave={handleMouseLeave}
        >
          <Files size={24} />
          {renderTooltip('explorer', 'Explorer')}
        </button>
        
        <button
          className={`relative p-3 rounded-lg transition-colors duration-200 ${
            activeView === 'search' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => onViewChange('search')}
          onMouseEnter={() => handleMouseEnter('search')}
          onMouseLeave={handleMouseLeave}
        >
          <Search size={24} />
          {renderTooltip('search', 'Search')}
        </button>
        
        <button
          className={`relative p-3 rounded-lg transition-colors duration-200 ${
            activeView === 'git' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => onViewChange('git')}
          onMouseEnter={() => handleMouseEnter('git')}
          onMouseLeave={handleMouseLeave}
        >
          <GitBranch size={24} />
          {renderTooltip('git', 'Source Control')}
        </button>
        
        <button
          className={`relative p-3 rounded-lg transition-colors duration-200 ${
            activeView === 'debug' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => onViewChange('debug')}
          onMouseEnter={() => handleMouseEnter('debug')}
          onMouseLeave={handleMouseLeave}
        >
          <Play size={24} />
          {renderTooltip('debug', 'Run and Debug')}
        </button>
        
        <button
          className={`relative p-3 rounded-lg transition-colors duration-200 ${
            activeView === 'extensions' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => onViewChange('extensions')}
          onMouseEnter={() => handleMouseEnter('extensions')}
          onMouseLeave={handleMouseLeave}
        >
          <Zap size={24} />
          {renderTooltip('extensions', 'Extensions')}
        </button>
      </div>
      
      <div className="mt-auto">
        <button
          className={`relative p-3 rounded-lg transition-colors duration-200 ${
            activeView === 'settings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => onViewChange('settings')}
          onMouseEnter={() => handleMouseEnter('settings')}
          onMouseLeave={handleMouseLeave}
        >
          <Settings size={24} />
          {renderTooltip('settings', 'Settings')}
        </button>
      </div>
    </div>
  );
};

export default ActivityBar;