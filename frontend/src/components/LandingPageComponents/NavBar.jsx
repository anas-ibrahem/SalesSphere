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

  // Authentication buttons component for reuse
  const AuthButtons = ({ isMobile = false }) => {
    const baseButtonClass = "btn flex items-center justify-center px-4 py-2";
    const containerClass = isMobile
      ? "flex flex-col gap-4 mt-8"
      : "hidden lg:flex space-x-4";

    return (
      <div className={containerClass}>
        {isAuthenticated && employee ? (
          <>
            <NavLink
              to="/home"
              className={`${baseButtonClass} btn-accent bg-primary-accent text-white rounded-lg ${
                isMobile ? "w-full" : ""
              }`}
              onClick={isMobile ? handleBars : undefined}
            >
              <Dashboard className="mr-2" /> Dashboard
            </NavLink>
            <NavLink
              to="/logout"
              className={`${baseButtonClass} btn-primary ${
                isMobile ? "w-full" : ""
              }`}
              onClick={isMobile ? handleBars : undefined}
            >
              <Logout className="mr-2" /> Logout
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={`${baseButtonClass} btn-accent ${
                isMobile ? "w-full" : ""
              }`}
              onClick={isMobile ? handleBars : undefined}
            >
              <LuLogIn className="mr-2" /> Log In
            </NavLink>
            <NavLink
              to="/business-registration"
              className={`${baseButtonClass} btn-primary ${
                isMobile ? "w-full" : ""
              }`}
              onClick={isMobile ? handleBars : undefined}
            >
              <IoMdPersonAdd className="mr-2" /> Sign Up
            </NavLink>
          </>
        )}
      </div>
    );
  };

  return (
    <nav className="flex items-center justify-between py-2 px-3 bg-white shadow-lg sticky top-0 z-50">
      {/* Left Section: Logo and Navigation Links */}
      <div className="flex items-center space-x-4">
        <NavLink to="/" onClick={() => window.scrollTo(0, 0)}>
          <Logo className="w-20 lg:w-24" />
        </NavLink>
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
        <AuthButtons />
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
        <button onClick={handleBars} className="absolute top-4 right-4">
          <ImCross
            size={20}
            className="transition-colors duration-200 ease-in-out hover:text-yellow-300"
          />
        </button>

        <ul className="flex flex-col mt-20 space-y-6 px-8">
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer">
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
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer">
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
          <li className="font-semibold text-lg text-gray-800 hover:text-gray-900 transition-colors duration-200 ease-in-out px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer">
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
          <AuthButtons isMobile={true} />
        </ul>
      </div>
    </nav>
  );
}