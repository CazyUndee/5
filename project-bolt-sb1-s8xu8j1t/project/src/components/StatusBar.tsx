import React from 'react';
import { GitBranch, Wifi, Bell } from 'lucide-react';

const StatusBar: React.FC = () => {
  return (
    <div className="h-6 bg-blue-600 text-white flex items-center justify-between px-2 text-xs">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <GitBranch size={14} className="mr-1" />
          <span>main</span>
        </div>
        <div>
          <span>TypeScript 5.5.3</span>
        </div>
        <div>
          <span>Spaces: 2</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div>
          <span>UTF-8</span>
        </div>
        <div>
          <span>LF</span>
        </div>
        <div className="flex items-center">
          <Wifi size={14} className="mr-1" />
          <span>Connected</span>
        </div>
        <div>
          <Bell size={14} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;