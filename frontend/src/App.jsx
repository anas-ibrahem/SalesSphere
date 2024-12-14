import Home from "./pages/Home"
import { Navigate , Route , Routes } from "react-router-dom";
import Login from "./pages/Login";
import BusinessRegistration from "./pages/BusinessRegistration";
import { useEffect, useState } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import toast, { Toaster } from 'react-hot-toast';

import UserContext, { UserProvider } from './context/UserContext';
import fetchAPI from "./utils/fetchAPI";



function App() {
  

  return (
    <div>
      <UserProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/business-registration" element={<BusinessRegistration />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;