import React, { useState ,  useContext, useEffect} from "react";
import SideBar from "../../components/SideBar";
import {
  BusinessSection,
  DefaultSection,
} from "../../components/SectionComponents";
import RecordsSection from "../../components/LayoutSections/RecordsSection";
import LogsSection from "../../components/LayoutSections/LogsSection";
import DealsSection from "../../components/LayoutSections/DealsSection";
import EmployeesSection from "../../components/LayoutSections/EmployeesSection";
import CustomersSection from "../../components/LayoutSections/CustomersSection";
import { useNavigate } from 'react-router-dom';
import { Navigate , Route , Routes } from "react-router-dom";
import AdminContext from "../../context/AdminContext";
import BusinessRequests from "../../components/AdminSections/BusinessRequests";
import ManageAdmins from "../../components/AdminSections/ManageAdmins";


function AdminHome() {
  const [activeSection, setActiveSection] = useState("default");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, admin } = useContext(AdminContext);
  const Navigate = useNavigate();

  console.log('isAuthenticated:', isAuthenticated);

  //   useEffect(() => {
  //     if (!isAuthenticated) {
  //       Navigate('/admin/login'); 
  //     }
  //   }, [isAuthenticated, Navigate]);

  // if (!isAuthenticated) return null;

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
        <SideBar
          onSectionChange={handleSectionChange}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          type="admin"
        />

      {/* Main content area on the right */}
      <div
        className={`
        flex flex-col flex-grow 
        duration-300 
      `}
      style={
        {
          backgroundColor: "#f5f5f5",
          width: isSidebarCollapsed ? "calc(100% - 60px)" : "calc(100% - 250px)",
        }
      }
      >
        <div className="max-h-full overflow-y-auto p-3">
          <h1>Welcome, Amr</h1>
            <Routes>
              <Route path="/" element={<BusinessRequests />} />
              <Route path="/admins" element={<ManageAdmins />} />
            </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
