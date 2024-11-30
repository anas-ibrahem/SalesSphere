import React from 'react';
import { Home, FileText, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from './Logo';

export default function SideBar({ onSectionChange, isCollapsed, toggleSidebar }) {
  return (
    <div
      className={`
        h-screen fixed top-0 left-0 flex flex-col 
        transition-all duration-300 
        ${isCollapsed ? 'w-16' : 'w-64'}
        text-white
      `}
      style={{ backgroundColor: '#111827' }}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <Logo logoChoice={2} size="h-[48px] w-[48px]" />
        {!isCollapsed && (
          <button 
            onClick={() => onSectionChange('default')} // Or any other action you want
            className="self-center text-xl font-semibold whitespace-nowrap ml-2 text-white hover:text-gray-400 transition-all duration-300"
          >
            SalesSphere
          </button>
        )}
      </div>

      {/* Toggle Button Below the Logo */}
      <div className="flex justify-center my-4">
        <button 
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-700 p-2 rounded transition-all duration-300 focus:outline-none"
        >
          {isCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="flex-grow space-y-2 px-2">
        <li>
          <button
            onClick={() => onSectionChange('business')}
            className={`
              flex items-center py-2 
              ${isCollapsed ? 'justify-center' : 'px-4'}
              rounded hover:bg-gray-700 w-full text-left
            `}
          >
            <Home className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>Business</span>}
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange('logs')}
            className={`
              flex items-center py-2 
              ${isCollapsed ? 'justify-center' : 'px-4'}
              rounded hover:bg-gray-700 w-full text-left
            `}
          >
            <FileText className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>Logs</span>}
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange('records')}
            className={`
              flex items-center py-2 
              ${isCollapsed ? 'justify-center' : 'px-4'}
              rounded hover:bg-gray-700 w-full text-left
            `}
          >
            <DollarSign className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>Financial Records</span>}
          </button>
        </li>
      </ul>
    </div>
  );
}
