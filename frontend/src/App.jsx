import Home from "./pages/Home"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import BusinessRegistration from "./pages/BusinessRegistration";
import { useContext, useEffect, useState } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import toast, { Toaster } from 'react-hot-toast';
import NotFoundPage from "./pages/NotFoundPage";

import UserContext, { UserProvider } from './context/UserContext';
import fetchAPI from "./utils/fetchAPI";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminApp from "./pages/admin/AdminApp";
import ForgotPassword from "./pages/ForgotPassword";

function Logout() {
  const { setIsAuthenticated, setToken } = useContext(UserContext);
  const Navigate = useNavigate();

  useEffect(() => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    Navigate('/');
    toast.success('Logged out successfully', {icon: '👋'});
  }, [setIsAuthenticated, setToken]);
  return <LoadingScreen />;
}

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
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/business-registration" element={<BusinessRegistration />} />
          {/* admin */}
          <Route path="/admin/*" element={<AdminApp />} />
          {/* 404 route - should always be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;