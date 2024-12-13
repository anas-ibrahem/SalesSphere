import React, { useContext, useEffect } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Button } from '@mui/material'; // Import Material UI Button
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { isAuthenticated, employee } = useContext(UserContext);
  const Navigate = useNavigate();

  console.log('isAuthenticated:', isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        Navigate('/login'); 
      }
    }, [isAuthenticated, Navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar on the left */}
      <SideBar />

      {/* Main content area */}
      <div className="flex flex-col flex-grow ml-64">
        {/* TODO NO NAVBAR HERE */}
        <NavBar /> {/* Navbar on top   */}

        {/* Horizontal layout for three vertical sections */}
        <div className="flex flex-row h-full p-8 space-x-8">
          {/* Section 1 */}
          <section className="bg-white p-6 shadow-md rounded-lg flex-grow">
            <h1 className="text-2xl font-bold mb-4">Header 1</h1>
            <p>Content for Section 1</p>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-6 shadow-md rounded-lg flex-grow">
            <h1 className="text-2xl font-bold mb-4">Header 2</h1>
            <p>Content for Section 2</p>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-6 shadow-md rounded-lg flex-grow">
            <h1 className="text-2xl font-bold mb-4">Header 3</h1>
            <p>Content for Section 3</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;
