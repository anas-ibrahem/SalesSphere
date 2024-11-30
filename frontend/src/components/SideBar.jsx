import React from 'react';
import Logo from './Logo';  // Assuming you have a Logo component or image

export default function SideBar({ onSectionChange }) {
  return (
    <div
      className="h-screen w-64 text-white fixed top-0 left-0 flex flex-col"
      style={{ backgroundColor: '#111827' }}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <Logo className="w-20 lg:w-24" /> {/* Assuming Logo component, adjust width as needed */}
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white ml-2">
          SalesSphere
        </span>
      </div>

      {/* Navigation Links */}
      <ul className="flex-grow mt-8 space-y-4 px-4">
        <li>
          <button
            onClick={() => onSectionChange('business')}
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Business
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange('logs')}
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Logs
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange('records')}
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Financial Records
          </button>
        </li>
      </ul>
    </div>
  );
}
