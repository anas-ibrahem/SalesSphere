import { Navigate , Route , Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

import AdminLogin from "./AdminLogin";
import { AdminProvider } from "../../context/AdminContext";
import AdminHome from "./AdminHome";



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
          <Route path="/*" element={<AdminHome />} />
        </Routes>
      </AdminProvider>
    </div>
  );
}

export default AdminApp;