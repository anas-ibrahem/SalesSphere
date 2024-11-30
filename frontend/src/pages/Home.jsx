import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import {BusinessSection , LogsSection , RecordsSection , DefaultSection} from '../components/SectionComponents';

function Home() {
  // State to manage the active section
  const [activeSection, setActiveSection] = useState('default');

  // Function to handle section changes
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="h-screen flex " style={{ backgroundColor: 'var(--tertiary-accent)' }}>
      {/* Sidebar on the left */}
      <SideBar onSectionChange={handleSectionChange} />

      {/* Main content area */}
      <div className="flex h-screen flex-col flex-grow ml-64">
        <div className="h-full">
          {/* Dynamically render the active section */}
          {activeSection === 'business' && <BusinessSection />}
          {activeSection === 'logs' && <LogsSection />}
          {activeSection === 'records' && <RecordsSection />}
          {activeSection === 'default' && <DefaultSection />}
        </div>
      </div>
    </div>
  );
}

export default Home;
