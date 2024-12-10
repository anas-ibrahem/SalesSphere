import React, { useState } from "react";
import { Star, Medal, UserPlus, TrendingUp, BarChart2, List, X } from "lucide-react";

// Mock Data for Testing
const mockEmployeeData = {
  name: "Tamer Elyar",
  email: "john.doe@company.com",
  type: "Sales Representative",
  profilePicture: "https://yt3.googleusercontent.com/ytc/AIdro_mQAsn4usidMAmf8_liUmjs9yOMT4j2Zcb1TYwNZa8jVw=s900-c-k-c0x00ffffff-no-rj",
  numberOfDeals: 25,
  numberOfSuccessfulDeals: 18,
  customersAddedThisMonth: 5,
  totalCustomersAdded: 45,
  performanceMetrics: {
    salesTarget: 50000,
    targetGoal: 40000,
    performanceNotes: "Consistently exceeding monthly targets"
  },
  badges: ["Top Performer", "Customer Champion"],
  dealsList: [
    { id: 1, client: "Acme Corp", value: "$15,000", status: "Closed Won" },
    { id: 2, client: "Tech Innovations", value: "$22,500", status: "Closed Won" }
  ],
  customersList: [
    { id: 1, name: "Alice Smith", company: "Tech Startup" },
    { id: 2, name: "Bob Johnson", company: "Digital Solutions" }
  ]
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

const EmployeeProfile = (props) => {
  var { employee = mockEmployeeData, back } = props;
  employee = mockEmployeeData;

  const [activeModal, setActiveModal] = useState(null);

  // Safely calculate success rate with default values
  const numberOfDeals = employee.numberOfDeals || 0;
  const numberOfSuccessfulDeals = employee.numberOfSuccessfulDeals || 0;
  
  const successRate = numberOfDeals > 0 
    ? ((numberOfSuccessfulDeals / numberOfDeals) * 100).toFixed(2) 
    : '0.00';

  // Performance calculation
  const performanceScore = employee.performanceMetrics ? 
    (
      (employee.performanceMetrics.salesTarget || 0) / 
      (employee.performanceMetrics.targetGoal || 1) * 
      100
    ).toFixed(2) 
    : '0.00';

  return (
    <div className="bg-white m-0 rounded shadow-xl w-full h-screen flex flex-col overflow-hidden">
      {/* Modal for Deals or Customers */}
      {activeModal === 'deals' && (
        <DetailModal 
          title="Deals Details" 
          data={employee.dealsList || []} 
          onClose={() => setActiveModal(null)} 
        />
      )}
      {activeModal === 'customers' && (
        <DetailModal 
          title="Customers Details" 
          data={employee.customersList || []} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      <div className="relative h-[150px] bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0">
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
        
        <div className="absolute bottom-[-45px] left-5 h-[90px] w-[90px] shadow-md rounded-full border-4 overflow-hidden border-white">
          <img
            src={employee.profilePicture}
            alt={`${employee.name || 'Employee'}'s profile`}
            className="w-full h-full rounded-full object-center object-cover"
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto px-5 py-2 mt-12">
        <div className="flex flex-col gap-3 pb-6">
          <div>
            <h3 className="text-xl text-slate-900 relative font-bold leading-6">
              {employee.name || 'Employee Name'}
            </h3>
            <p className="text-sm text-gray-600">{employee.email || 'No email provided'}</p>
          </div>

          <h4 className="text-md font-medium leading-3">About</h4>
          <p className="text-sm text-stone-500">{employee.type || 'No type specified'}</p>

          {/* Deals Section */}
          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Deals
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Total Deals</p>
                <p className="text-lg font-bold">{numberOfDeals}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="text-lg font-bold">{successRate}%</p>
              </div>
            </div>
            {employee.dealsList && employee.dealsList.length > 0 && (
              <button 
                onClick={() => setActiveModal('deals')}
                className="mt-2 w-full text-sm text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center justify-center"
              >
                <List className="w-4 h-4 mr-2" /> View Deals Details
              </button>
            )}
          </div>

          {/* Customers Added Section */}
          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" /> Customers Added
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">This Month</p>
                <p className="text-lg font-bold">{employee.customersAddedThisMonth || 0}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-bold">{employee.totalCustomersAdded || 0}</p>
              </div>
            </div>
            {employee.customersList && employee.customersList.length > 0 && (
              <button 
                onClick={() => setActiveModal('customers')}
                className="mt-2 w-full text-sm text-green-600 hover:bg-green-50 p-2 rounded flex items-center justify-center"
              >
                <List className="w-4 h-4 mr-2" /> View Customers Details
              </button>
            )}
          </div>

          {/* Performance Metrics Section */}
          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-600" /> Performance
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Sales Target</p>
                <p className="text-lg font-bold">
                  {employee.performanceMetrics?.salesTarget || 0}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Performance Score</p>
                <p className={`text-lg font-bold ${
                  performanceScore > 100 
                    ? 'text-green-600' 
                    : performanceScore > 75 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                }`}>
                  {performanceScore}%
                </p>
              </div>
            </div>
            {employee.performanceMetrics?.performanceNotes && (
              <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Performance Notes</p>
                <p className="text-sm text-gray-700">
                  {employee.performanceMetrics.performanceNotes}
                </p>
              </div>
            )}
          </div>

          {/* Badges Section */}
          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-600" /> Badges
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {employee.badges && employee.badges.length > 0 ? (
                employee.badges.map((badge, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    <Star className="w-4 h-4 text-blue-500" />
                    {badge}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No badges earned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;