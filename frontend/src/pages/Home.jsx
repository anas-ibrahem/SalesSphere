import React, { useState } from "react";
import SideBar from "../components/SideBar";
import {
  BusinessSection,
  DefaultSection,
} from "../components/SectionComponents";
import RecordsSection from "../components/LayoutSections/RecordsSection";
import LogsSection from "../components/LayoutSections/LogsSection";
import DealsSection from "../components/LayoutSections/DealsSection";
import EmployeesSection from "../components/LayoutSections/EmployeesSection";
import CustomersSection from "../components/LayoutSections/CustomersSection";

function Home() {
  const [activeSection, setActiveSection] = useState("default");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className="h-screen flex"
      style={{ backgroundColor: "var(--tertiary-accent)" }}
    >
      {/* Sidebar on the left */}
      <SideBar
        onSectionChange={handleSectionChange}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content area */}
      <div
        className={`
        flex h-screen flex-col flex-grow 
        transition-all duration-300 
        ${isSidebarCollapsed ? "ml-16" : "ml-64"}
      `}
      >
        <div className="h-full">
          {activeSection === "business" && <BusinessSection />}
          {activeSection === "logs" && <LogsSection />}
          {activeSection === "records" && <RecordsSection />}
          {activeSection === "deals" && <DealsSection />}
          {activeSection === "employees" && <EmployeesSection />}
          {activeSection === "customers" && <CustomersSection />}
          {activeSection === "default" && <DefaultSection />}
        </div>
      </div>
    </div>
  );
}

export default Home;