import React, { useState, useEffect } from "react";
import { ArrowLeft, User, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useParams } from "react-router-dom";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DealStatus } from "../../utils/Enums";
import ProfileModal from "./ProfileModal";
import fetchAPI from "../../utils/fetchAPI";

function DealDetails({ onBack = () => {} }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { dealId } = useParams();
  const [deal, setDeal] = useState({});
  const [financialRecords, setFinancialRecords] = useState([]); // Initialize as empty array
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [dealStatus, setDealStatus] = useState(0);
  const [closingDealStatus, setClosingDealStatus] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const executer = true; // TODO - Replace with actual user role
  const opener = true; // TODO - Replace with actual user role

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch deal details
        const dealData = await fetchAPI(`/deal/${dealId}`, "GET", null, token);
        setDeal(dealData);
        setDealStatus(dealData.status);

        // Fetch financial records
        const financialData = await fetchAPI(`/finance/${dealId}`, "GET", null, token);
        // Ensure financialData is an array
        const records = Array.isArray(financialData) ? financialData : [];
        setFinancialRecords(records);
        
        // Calculate totals
        const expenses = records
          .filter(record => record?.type === 'expense')
          .reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
        
        const income = records
          .filter(record => record?.type === 'income')
          .reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
        
        setTotalExpenses(expenses);
        setTotalIncome(income);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading deal information");
        // Initialize with empty array if there's an error
        setFinancialRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dealId, dealStatus, token]);

  const {
    title = "Untitled Deal",
    status = 0,
    description = "No description available",
    date_opened = new Date(),
    due_date = new Date(),
    expenses = 0,
    customer_budget = 0,
    customer = null,
    deal_executor = null,
    deal_opener = null,
    id = dealId,
  } = deal;

  function handelClaimDeal() {
    fetchAPI(`/deal/claim`, "POST", { id }, token)
      .then(() => {
        setDealStatus(1);
        toast.success("Deal claimed successfully");
      })
      .catch(() => toast.error("Error claiming deal"));
  }

  function handelCloseDeal() {
    fetchAPI(`/deal/close`, "POST", { id, status: closingDealStatus }, token)
      .then(() => {
        setDealStatus(closingDealStatus);
        toast.success("Deal closed successfully");
      })
      .catch(() => toast.error("Error closing deal"));
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading deal information...</div>
      </div>
    );
  }

  const renderFinancialRecords = () => {
    if (!Array.isArray(financialRecords) || financialRecords.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center">
            No financial records found
          </td>
        </tr>
      );
    }

    return financialRecords.map((record, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="px-6 py-4 text-sm text-gray-900">
          <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
            ${(Number(record.amount) || 0).toLocaleString()}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(record.date).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 capitalize">
          {record.type || 'N/A'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 capitalize">
          {record.payment_method || 'N/A'}
        </td>
      </tr>
    ));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-6 max-w-7xl mx-auto">
            {selectedProfile && (
              <ProfileModal
                profile={selectedProfile}
                onClose={() => setSelectedProfile(null)}
              />
            )}
            
            {/* Header Section */}
            <div className="flex justify-between items-center mb-1">
              <button 
                  type="button" 
                  onClick={onBack} 
                  className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
              >
                  <ArrowLeft className="mr-2" /> Back
              </button>
  
              <div className="flex space-x-3">
                {executer && deal.status === 0 && (
                  <button
                    onClick={handelClaimDeal}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Claim Deal
                  </button>
                )}
                
                {executer && deal.status === 1 && (
                  <div className="flex space-x-2">
                    <select
                      className="px-4 py-2 border rounded"
                      onChange={(e) => setClosingDealStatus(Number(e.target.value))}
                      value={closingDealStatus}
                    >
                      <option value={2}>Closed Won</option>
                      <option value={3}>Closed Lost</option>
                    </select>
                    <button
                      onClick={handelCloseDeal}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Close Deal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Title and Status */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {DealStatus[status]}
              </span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Deal Information Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Deal Information</h2>
                <div className="space-y-3">
                  <p className="text-gray-700"><span className="font-medium">Description:</span> {description}</p>
                  <p className="text-gray-700">
                    <span className="font-medium">Date Opened:</span>{" "}
                    {new Date(date_opened).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Due Date:</span>{" "}
                    {new Date(due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Financial Summary Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-600">Total Income</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ${totalIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium text-red-600">Total Expenses</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      ${totalExpenses.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Deal Opener */}
              <div
                onClick={() => deal_opener?.id && navigate(`/home/employees/${deal_opener.id}`)}
                className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${
                  deal_opener?.id ? 'hover:shadow-md transition cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {deal_opener?.profile_picture_url ? (
                    <img
                      src={deal_opener.profile_picture_url}
                      alt={deal_opener.first_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">Deal Opener</h3>
                    <p className="text-gray-600">
                      {deal_opener ? `${deal_opener.first_name} ${deal_opener.last_name}` : 'Not Assigned'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deal Executor */}
              {deal.status === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 font-medium">Not Claimed Yet</p>
                </div>
              ) : (
                <div
                  onClick={() => deal_executor?.id && navigate(`/home/employees/${deal_executor.id}`)}
                  className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${
                    deal_executor?.id ? 'hover:shadow-md transition cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {deal_executor?.profile_picture_url ? (
                      <img
                        src={deal_executor.profile_picture_url}
                        alt={deal_executor.first_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">Deal Executor</h3>
                      <p className="text-gray-600">
                        {deal_executor ? `${deal_executor.first_name} ${deal_executor.last_name}` : 'Not Assigned'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer */}
              <div
                onClick={() => customer?.id && navigate(`/home/customers/${customer.id}`)}
                className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${
                  customer?.id ? 'hover:shadow-md transition cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Customer</h3>
                    <p className="text-gray-600">{customer?.name || 'Not Assigned'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Records Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Financial Records</h2>
                  {executer && deal.status === 1 && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                      Add Financial Record
                    </button>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {renderFinancialRecords()}
                  </tbody>
                  {Array.isArray(financialRecords) && financialRecords.length > 0 && (
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="4" className="px-6 py-4">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Total Records: {financialRecords.length}</span>
                            <span className="font-medium">
                              Net Balance: 
                              <span className={totalIncome - totalExpenses >= 0 ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                                ${(totalIncome - totalExpenses).toLocaleString()}
                              </span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default DealDetails;