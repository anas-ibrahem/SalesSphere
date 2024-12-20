import React, { useState, useEffect, useContext } from "react";
import { Search, Clock, ArrowUpDown } from "lucide-react";
import Pagination from '../Pagination';
import fetchAPI from "../../utils/fetchAPI";
import { EmployeeRoles, PaymentMethods } from "../../utils/Enums";
import {FinancialRecordTypes} from "../../utils/Enums";
import UserContext from "../../context/UserContext";

const getTypeString = (type) => {
  return type === FinancialRecordTypes.Income ? "Income" : "Expense";
};

const getPaymentMethodString = (paymentMethod) => {
  switch (paymentMethod) {
    case PaymentMethods.Cash:
      return "Cash";
    case PaymentMethods.Card:
      return "Card";
    case PaymentMethods.BankTransfer:
      return "Bank Transfer";
    case PaymentMethods.ElectronicPayment:
      return "Electronic Payment";
    case PaymentMethods.Other:
      return "Other";
    default:
      return "Unknown";
  }
};

function RecordsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [sortField, setSortField] = useState("transaction_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]); 
  const {employee : me} = useContext(UserContext);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await fetchAPI('/finance', 'GET', null, localStorage.getItem("token"));
        setRecords(data);
        console.log("Records fetched:", data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtering and search logic
  const filteredRecords = records.filter((record) => {
    const matchesType = filterType === "All" || getTypeString(record.type) === filterType;
    const matchesSearch = record.deal_title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Updated sorting logic to handle Income/Expense properly
  const sortedRecords = filteredRecords.sort((a, b) => {
    if (sortField === "amount") {
      // Convert amounts to numbers with proper sign based on type
      const amountA = Number(a.type) === FinancialRecordTypes.Income 
        ? parseFloat(a.amount) 
        : -parseFloat(a.amount);
      const amountB = Number(b.type) === FinancialRecordTypes.Income 
        ? parseFloat(b.amount) 
        : -parseFloat(b.amount);
      return (sortOrder === "asc" ? 1 : -1) * (amountA - amountB);
    }
    return (sortOrder === "asc" ? 1 : -1) * (new Date(a.transaction_date) - new Date(b.transaction_date));
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const currentRecords = sortedRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

 
  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8">
          
          {me.role !== EmployeeRoles.Manager &&
            <span>Your </span>}
                      
          {me.role === EmployeeRoles.Manager &&
            <span>Business' </span>}
          Financial Records</h1>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by deal name..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
              >
                <option value="All">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <select
                onChange={(e) => setSortField(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortField}
              >
                <option value="transaction_date">Date</option>
                <option value="amount">Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Date & Time
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Payment Method</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Deal Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr 
                      className="hover:bg-gray-50 cursor-pointer transition-colors" 
                      onClick={() => handleExpand(record.id)}
                    >
                      <td className="px-6 py-4 text-sm">
                        <span className={
                          getTypeString(record.type) === "Income" 
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }>
                          {getTypeString(record.type) === "Income" ? "+" : "-"}${record.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateTime(record.transaction_date)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getTypeString(record.type) === "Income" 
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {getTypeString(record.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-1 text-gray-500">{getPaymentMethodString(record.payment_method)}</td>
                      <td className="px-6 py-4 text-sm max-w-1 text-gray-900">{record.deal_title}</td>
                    </tr>
                    {expandedId === record.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            <strong className="font-medium">Description:</strong>
                            <p className="mt-1">{record.description}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Showing {currentRecords.length} of {filteredRecords.length} records</span>
              <span>
                Total: {currentRecords.reduce((sum, record) => sum + (
                  Number(record.type) === FinancialRecordTypes.Income
                    ? parseFloat(record.amount) 
                    : -parseFloat(record.amount)
                ), 0).toLocaleString('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
}

export default RecordsSection;