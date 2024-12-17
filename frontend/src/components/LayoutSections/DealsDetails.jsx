import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import ProfileModal from './ProfileModal';


// Modified Deal Details Component
function DealDetails({ deal = {}, onBack = () => {} }) {
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Mock profile data (in a real app, this would come from your backend)
  const profiles = {
    deal_opener: {
      name: 'Emily Rodriguez',
      role: 'Senior Sales Representative',
      photo: '/api/placeholder/200/200?text=ER',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Sales'
    },
    deal_executor: {
      name: 'Michael Chen',
      role: 'Account Executive',
      photo: '/api/placeholder/200/200?text=MC',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 987-6543',
      department: 'Sales'
    },
    customer_contact: {
      name: 'David Thompson',
      role: 'Procurement Manager',
      photo: '/api/placeholder/200/200?text=DT',
      email: 'david.thompson@customer.com',
      phone: '+1 (555) 246-8135',
      department: 'Procurement'
    }
  };

  // Safely extract deal properties with default values
  const {
    title = 'Untitled Deal',
    status = 'Unknown',
    description = 'No description available',
    account_manager = 'Unassigned',
    probability_of_close = 'N/A',
    next_steps = 'No next steps',
    date_opened = new Date(),
    due_date = new Date(),
    expenses = 0,
    customer_budget = 0,
    total_value = 0
  } = deal;

  return (
    <div className="p-4">
      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}

      <button 
        onClick={onBack} 
        className="mb-3 px-3 py-1 bg-blue-800 text-white text-sm rounded hover:bg-blue-600 transition flex items-center"
      >
        <ArrowLeft className="mr-2" />
        Back to Deals List
      </button>

      <h1 className="text-2xl font-bold mb-3">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Deal Information */}
        <div className="flex flex-col h-full"> 
          <div className="bg-white border-4 shadow-sm rounded-lg p-4 flex-grow">
            <h2 className="text-lg font-semibold mb-2">Deal Information</h2>
            <p><strong>Status:</strong> {status.replace('_', ' ')}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Account Manager:</strong> {account_manager}</p>
            <p><strong>Probability of Close:</strong> {probability_of_close}</p>
            <p><strong>Next Steps:</strong> {next_steps}</p>
          </div>
        </div>

        {/* Financial Details */}
        <div className="flex flex-col h-full">
          <div className="bg-white border-4 shadow-sm rounded-lg p-4 flex-grow">
            <h2 className="text-lg font-semibold mb-2">Financial Details</h2>
            <p><strong>Date Opened:</strong> {new Date(date_opened).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> {new Date(due_date).toLocaleDateString()}</p>
            <p><strong>Expenses:</strong> ${expenses.toLocaleString()}</p>
            <p><strong>Customer Budget:</strong> ${customer_budget.toLocaleString()}</p>
            <p><strong>Total Value:</strong> ${total_value.toLocaleString()}</p>
          </div>
        </div>

        {/* Profiles Section */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Deal Opener Profile */}
          <div 
            onClick={() => setSelectedProfile(profiles.deal_opener)}
            className="bg-white border-4 shadow-sm rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition flex items-center"
          >
            <div className="mr-4">
              {profiles.deal_opener.photo ? (
                <img 
                  src={profiles.deal_opener.photo} 
                  alt={profiles.deal_opener.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="text-3xl text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Deal Opener</h3>
              <p>{profiles.deal_opener.name}</p>
              <p className="text-sm text-gray-600">{profiles.deal_opener.role}</p>
            </div>
          </div>

          {/* Deal Executor Profile */}
          <div 
            onClick={() => setSelectedProfile(profiles.deal_executor)}
            className="bg-white border-4 shadow-sm rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition flex items-center"
          >
            <div className="mr-4">
              {profiles.deal_executor.photo ? (
                <img 
                  src={profiles.deal_executor.photo} 
                  alt={profiles.deal_executor.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="text-3xl text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Deal Executor</h3>
              <p>{profiles.deal_executor.name}</p>
              <p className="text-sm text-gray-600">{profiles.deal_executor.role}</p>
            </div>
          </div>

          {/* Customer Profile */}
          <div 
            onClick={() => setSelectedProfile(profiles.customer_contact)}
            className="bg-white border-4 shadow-sm rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition flex items-center"
          >
            <div className="mr-4">
              {profiles.customer_contact.photo ? (
                <img 
                  src={profiles.customer_contact.photo} 
                  alt={profiles.customer_contact.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="text-3xl text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Customer</h3>
              <p>{profiles.customer_contact.name}</p>
              <p className="text-sm text-gray-600">{profiles.customer_contact.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealDetails;