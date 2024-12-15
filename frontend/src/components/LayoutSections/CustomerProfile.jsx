import React, { useState } from "react";
import { Star, Medal, UserPlus, TrendingUp, BarChart2, List, X } from "lucide-react";

// Mock Data for Testing
const mockCustomerData = {
  name: "Alice Smith",
  email: "alice.smith@example.com",
  company: "Tech Startup",
  contactNumber: "+1 (555) 123-4567",
  totalPurchases: 12,
  totalSpend: "$180,000",
  recentPurchases: [
    { id: 1, product: "Enterprise Software", value: "$45,000", date: "2024-01-15" },
    { id: 2, product: "Consulting Services", value: "$35,000", date: "2023-11-20" }
  ],
  interactions: [
    { id: 1, type: "Sales Call", date: "2024-02-05", notes: "Discussed expansion plans" },
    { id: 2, type: "Support Ticket", date: "2023-12-10", notes: "Resolved technical issue" }
  ],
  loyaltyStatus: "Gold",
  customerSince: "2022-03-15"
};

const DetailModal = ({ title, data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {Object.keys(data[0] || {}).map((header) => (
                  <th key={header} className="py-2 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  {Object.values(item).map((value, valueIndex) => (
                    <td key={valueIndex} className="py-2">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="text-center text-gray-500 py-4">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerProfile = (props) => {
  const { customer = mockCustomerData, back } = props;

  const [activeModal, setActiveModal] = useState(null);

  // Calculate customer loyalty metrics
  const customerSince = new Date(customer.customerSince);
  const yearsAsMember = Math.floor((new Date() - customerSince) / (1000 * 60 * 60 * 24 * 365));

  return (
    <div className="bg-white m-0 rounded shadow-xl w-full h-screen flex flex-col overflow-hidden">
      {/* Modal for Purchases or Interactions */}
      {activeModal === 'purchases' && (
        <DetailModal 
          title="Recent Purchases" 
          data={customer.recentPurchases || []} 
          onClose={() => setActiveModal(null)} 
        />
      )}
      {activeModal === 'interactions' && (
        <DetailModal 
          title="Customer Interactions" 
          data={customer.interactions || []} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      <div className="relative h-[85px] bg-gradient-to-r from-blue-500 to-blue-800 flex-shrink-0">
        <button
          onClick={back}
          className="absolute top-6 left-6 inline-flex w-auto cursor-pointer 
          select-none appearance-none items-center 
          justify-center space-x-1 rounded border border-gray-200
           bg-white px-3 py-2 text-sm font-medium text-gray-800 transition 
           hover:border-gray-300 active:bg-white hover:bg-gray-100"
        >
          Back
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto px-5 py-2 mt-6">
        <div className="flex flex-col gap-3 pb-6">
          <div>
            <h3 className="text-xl text-slate-900 relative font-bold leading-6">
              {customer.name || 'Customer Name'}
            </h3>
            <p className="text-sm text-gray-600">{customer.email || 'No email provided'}</p>
          </div>

          <h4 className="text-md font-medium leading-3">Company</h4>
          <p className="text-sm text-stone-500">{customer.company || 'No company specified'}</p>

          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Purchases
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Total Purchases</p>
                <p className="text-lg font-bold">{customer.totalPurchases || 0}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Total Spend</p>
                <p className="text-lg font-bold">{customer.totalSpend || '$0'}</p>
              </div>
            </div>
            {customer.recentPurchases && customer.recentPurchases.length > 0 && (
              <button 
                onClick={() => setActiveModal('purchases')}
                className="mt-2 w-full text-sm text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center justify-center"
              >
                <List className="w-4 h-4 mr-2" /> View Purchase Details
              </button>
            )}
          </div>

          {/* Customer Interactions Section */}
          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" /> Customer Interactions
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Customer Since</p>
                <p className="text-lg font-bold">{customer.customerSince || 'N/A'}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Years as Customer</p>
                <p className="text-lg font-bold">{yearsAsMember}</p>
              </div>
            </div>
            {customer.interactions && customer.interactions.length > 0 && (
              <button 
                onClick={() => setActiveModal('interactions')}
                className="mt-2 w-full text-sm text-green-600 hover:bg-green-50 p-2 rounded flex items-center justify-center"
              >
                <List className="w-4 h-4 mr-2" /> View Interaction Details
              </button>
            )}
          </div>

          {/* Loyalty Section */}
          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-600" /> Loyalty Status
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              <div 
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                <Star className="w-4 h-4 text-blue-500" />
                {customer.loyaltyStatus || 'Standard'}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-4">
            <h4 className="text-md font-medium">Contact Information</h4>
            <div className="bg-gray-50 p-3 rounded-lg mt-2">
              <p className="text-sm text-gray-700">
                <span className="text-xs text-gray-500 block">Phone</span>
                {customer.contactNumber || 'No contact number'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;