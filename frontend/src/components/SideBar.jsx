import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed top-0 left-0 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <NavLink to="/">
          <img src="https://i.ibb.co/6s0gPZj/Logo-No-Text.png" alt="logo" className="h-16 w-16" />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <ul className="flex-grow mt-8 space-y-4 px-4">
        <li>
          <NavLink to="/about" className="block py-2 px-4 rounded hover:bg-gray-700">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="block py-2 px-4 rounded hover:bg-gray-700">
            Contact Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className="block py-2 px-4 rounded hover:bg-gray-700">
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/help" className="block py-2 px-4 rounded hover:bg-gray-700">
            Help
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
