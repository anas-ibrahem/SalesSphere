import { Navigate , Route , Routes, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

import AdminLogin from "./AdminLogin";
import AdminContext, { AdminProvider } from "../../context/AdminContext";
import AdminHome from "./AdminHome";
import LoadingScreen from "../LoadingScreen";

function AdminLogout() {
  const { setIsAuthenticated, setToken } = useContext(AdminContext);
  const Navigate = useNavigate();

  useEffect(() => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    Navigate('/');
    toast.success('Logged out successfully', {icon: '👋'});
  }, [setIsAuthenticated, setToken]);
  return <LoadingScreen />;
}

function AdminApp() {
  return (
    <div>
      <AdminProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/logout" element={<AdminLogout />} />
          <Route path="/*" element={<AdminHome />} />
        </Routes>
      </AdminProvider>
    </div>
  );
}

export default AdminApp;