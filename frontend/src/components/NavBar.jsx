import React, { useState } from 'react';
import Logo from './Logo';
import { LuLogIn } from "react-icons/lu";
import { IoMdPersonAdd } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);

  const handleBars = () => {
    setShowMenu(!showMenu);
  }

  return (
    <nav className='flex items-center justify-between p-4 bg-white shadow-lg sticky top-0 z-50'>
      {/* Left Section: Logo and Navigation Links */}
      <div className='flex items-center space-x-4'>
        <Logo className="w-20 lg:w-24" /> {/* Fixed width for Logo */}

        {/* Navigation Links */}
        <ul className='hidden lg:flex space-x-6'>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#About'>About</a>
          </li>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#Contact'>Contact Us</a>
          </li>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#Services'>Services</a>
          </li>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#Help'>Help</a>
          </li>
        </ul>
      </div>

      {/* Right Section: Authentication Buttons and Hamburger Menu */}
      <div className='flex items-center space-x-4'>
        {/* Authentication Buttons */}
        <div className='hidden lg:flex space-x-4'>
          <NavLink to="login">
            <button className='btn btn-accent flex items-center justify-center px-4 py-2'>
              <LuLogIn className="mr-2" /> Log In
            </button>
          </NavLink>
          <NavLink to="signup">
            <button className='btn btn-primary flex items-center justify-center px-4 py-2'>
              <IoMdPersonAdd className="mr-2" /> Sign Up
            </button>
          </NavLink>
        </div>

        {/* Hamburger Menu Button (Visible on Mobile) */}
        <button onClick={handleBars} className='lg:hidden'>
          <FaBars size={25} className='transition-colors duration-200 ease-in-out hover:text-yellow-300'/>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg transition-transform duration-300 ease-in-out ${showMenu ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        {/* Close Button */}
        <button onClick={handleBars} className='absolute top-4 right-4'>
          <ImCross size={20} className='transition-colors duration-200 ease-in-out hover:text-yellow-300' />
        </button>

        {/* Mobile Navigation Links */}
        <ul className='flex flex-col mt-20 space-y-6 px-8'>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#About' onClick={handleBars}>About</a>
          </li>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#Contact' onClick={handleBars}>Contact Us</a>
          </li>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#Services' onClick={handleBars}>Services</a>
          </li>
          <li className='font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer'>
            <a href='#Help' onClick={handleBars}>Help</a>
          </li>

          {/* Mobile Authentication Buttons */}
          <div className='flex flex-col gap-4 mt-8'>
            <NavLink to="login">
              <button className='btn btn-accent flex items-center justify-center w-full px-4 py-2'>
                <LuLogIn className="mr-2" /> Log In
              </button>
            </NavLink>
            <NavLink to="signup">
              <button className='btn btn-primary flex items-center justify-center w-full px-4 py-2'>
                <IoMdPersonAdd className="mr-2" /> Sign Up
              </button>
            </NavLink>
          </div>
        </ul>
      </div>
    </nav>
  )
}