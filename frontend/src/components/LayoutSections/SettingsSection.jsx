import React, { useState, useContext } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button
} from "@material-tailwind/react";
import UserContext from '../../context/UserContext';
import EditEmployeeForm from '../Forms/EditEmployeeForm';
import { EmployeeRoles } from '../../utils/Enums';
import ChangePasswordForm from '../Forms/ChangePasswordForm';
import EditBusinessForm from '../Forms/EditBusinessForm';

const SettingsSection = () => {
  const { employee } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("Profile");
  const isManager = 2 === EmployeeRoles.Manager; // TODO - Replace with actual user role

  const BusinessSettings = () => (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Business Name" 
          size="lg"
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <Input 
          type="email" 
          label="Business Email" 
          size="lg"
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </div>
      <Input 
        label="Phone Number" 
        size="lg"
        className="!border-t-blue-gray-200 focus:!border-t-blue-500"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />
      <Textarea 
        label="Business Address" 
        size="lg"
        rows={4}
        className="!border-t-blue-gray-200 focus:!border-t-blue-500"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="City" 
          size="lg"
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <Input 
          label="Postal Code" 
          size="lg"
          className="!border-t-blue-gray-200 focus:!border-t-blue-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </div>
      <Button color="blue" size="lg" className="mt-6">
        Save Business Settings
      </Button>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'Profile':
        return <EditEmployeeForm employee={employee} />;
      case 'Business':
        return <EditBusinessForm />;
      case 'Password':
        return <ChangePasswordForm />;
      default:
        return <EditEmployeeForm employee={employee} onBack={() => null} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" bg-white w-full overflow-hidden">
        <div className="p-4 sm:p-6">
          <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
            Settings
          </Typography>
          <Typography color="gray" className="font-normal">
            Manage settings and info
          </Typography>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row border-b">
          {['Profile', 'Password'].map(tab => (
            <button
              key={tab}
              className={`w-full sm:flex-1 py-3 font-semibold uppercase tracking-wider text-sm 
                ${activeTab === tab 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          {isManager && (
            <button
              className={`w-full sm:flex-1 py-3 font-semibold uppercase tracking-wider text-sm 
                ${activeTab === 'Business' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('Business')}
            >
              Business
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;