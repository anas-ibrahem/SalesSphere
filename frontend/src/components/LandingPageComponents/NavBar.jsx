import React, { useContext, useState } from "react";
import Logo from "../Logo";
import { LuLogIn } from "react-icons/lu";
import { IoMdPersonAdd } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { NavLink } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { Dashboard, Logout } from "@mui/icons-material";
import { Link } from "react-scroll";

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, employee } = useContext(UserContext);

  const handleBars = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="flex items-center justify-between py-2 px-3 bg-white shadow-lg sticky top-0 z-50">
      {/* Left Section: Logo and Navigation Links */}
      <div className="flex items-center space-x-4">
        <NavLink to="/" onClick={() => window.scrollTo(0, 0)}>
          <Logo className="w-20 lg:w-24" /> {/* Fixed width for Logo */}
        </NavLink>
        {/* Navigation Links */}
        <ul className="hidden lg:flex space-x-6">
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer">
            <Link to="About" smooth={true} duration={500} offset={-50}>
              About
            </Link>
          </li>
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer">
            <Link to="Benefits" smooth={true} duration={500} offset={-100}>
              Benefits
            </Link>
          </li>
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer">
            <Link to="Mobile" smooth={true} duration={500} offset={100}>
              Mobile App
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Section: Authentication Buttons and Hamburger Menu */}
      <div className="flex items-center space-x-4">
        {/* Authentication Buttons */}
        <div className="hidden lg:flex space-x-4">
          {
            isAuthenticated && employee ? (
              <NavLink to="/home" className="btn btn-accent flex items-center justify-center px-4 py-2 bg-primary-accent text-white rounded-lg">
                <Dashboard className="mr-2" /> Dashboard
              </NavLink>
            ) : <NavLink to="/login">
                <button className="btn btn-accent flex items-center justify-center px-4 py-2">
                  <LuLogIn className="mr-2" /> Log In
                </button>
              </NavLink>
          }
          {
            !isAuthenticated || !employee ? (
              <NavLink to="/business-registration">
            <button className="btn btn-primary flex items-center justify-center px-4 py-2">
              <IoMdPersonAdd className="mr-2" /> Sign Up
            </button>
          </NavLink>
            ) : <NavLink to="/logout">
            <button className="btn btn-primary flex items-center justify-center px-4 py-2">
              <Logout className="mr-2" /> Logout
            </button>
          </NavLink>
          }
          
        </div>

        {/* Hamburger Menu Button (Visible on Mobile) */}
        <button onClick={handleBars} className="lg:hidden">
          <FaBars
            size={25}
            className="transition-colors duration-200 ease-in-out hover:text-yellow-300"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          showMenu ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        {/* Close Button */}
        <button onClick={handleBars} className="absolute top-4 right-4">
          <ImCross
            size={20}
            className="transition-colors duration-200 ease-in-out hover:text-yellow-300"
          />
        </button>

        {/* Mobile Navigation Links */}
        <ul className="flex flex-col mt-20 space-y-6 px-8">
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer">
            <Link
              to="About"
              smooth={true}
              duration={500}
              onClick={handleBars}
              offset={-50}
            >
              About
            </Link>
          </li>
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer">
            <Link
              to="Benefits"
              smooth={true}
              duration={500}
              onClick={handleBars}
              offset={-100}
            >
              Benefits
            </Link>
          </li>
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-red-200 cursor-pointer">
            <Link
              to="Mobile"
              smooth={true}
              duration={500}
              onClick={handleBars}
              offset={100}
            >
              Mobile App
            </Link>
          </li>

          {/* Mobile Authentication Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <NavLink to="login">
              <button className="btn btn-accent flex items-center justify-center w-full px-4 py-2">
                <LuLogIn className="mr-2" /> Log In
              </button>
            </NavLink>
            <NavLink to="signup">
              <button className="btn btn-primary flex items-center justify-center w-full px-4 py-2">
                <IoMdPersonAdd className="mr-2" /> Sign Up
              </button>
            </NavLink>
          </div>
        </ul>
      </div>
    </nav>
  );
}
