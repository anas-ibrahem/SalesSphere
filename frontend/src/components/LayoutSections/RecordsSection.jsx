import React, { useState, useEffect } from "react";
import { Search, Clock, ArrowUpDown } from "lucide-react";
import Pagination from '../Pagination';

// Generate dummy financial records
const generateDummyData = () => {
  const dummyRecords = [];
  const dealNames = ["Deal Alpha", "Deal Beta", "Deal Gamma", "Deal Delta"];
  for (let i = 1; i <= 50; i++) {
    dummyRecords.push({
      id: i,
      amount: (Math.random() * 1000 + 100).toFixed(2),
      transaction_date: new Date(2024, 10, i % 30 + 1).toISOString(),
      type: i % 2 === 0 ? "Income" : "Expense",
      description: `Description of transaction ${i}`,
      payment_method: i % 3 === 0 ? "Bank Transfer" : i % 3 === 1 ? "Credit Card" : "Cash",
      deal_name: dealNames[i % dealNames.length],
    });
  }
  return dummyRecords;
};

const dummyData = generateDummyData();

function RecordsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [sortField, setSortField] = useState("transaction_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate items per page based on screen height
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const headerHeight = 200;
      const paginationHeight = 60;
      const itemHeight = 40;
      const availableHeight = window.innerHeight - headerHeight - paginationHeight;
      const calculatedItemsPerPage = Math.floor(availableHeight / itemHeight);
      setItemsPerPage(Math.max(calculatedItemsPerPage, 5));
    };

    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  // Filtering and search logic
  const filteredRecords = dummyData.filter((record) => {
    const matchesType = filterType === "All" || record.type === filterType;
    const matchesSearch = record.deal_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Sorting logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortField === "amount") {
      return sortOrder === "asc" 
        ? parseFloat(a.amount) - parseFloat(b.amount) 
        : parseFloat(b.amount) - parseFloat(a.amount);
    } else {
      return sortOrder === "asc"
        ? new Date(a.transaction_date) - new Date(b.transaction_date)
        : new Date(b.transaction_date) - new Date(a.transaction_date);
    }
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
        <h1 className="text-3xl font-bold mb-8">Financial Records</h1>

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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
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
                      <td className="px-6 py-4 text-sm text-gray-900">#{record.id}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={
                          record.type === "Income" 
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }>
                          {record.type === "Income" ? "+" : "-"}${record.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateTime(record.transaction_date)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.type === "Income" 
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{record.payment_method}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.deal_name}</td>
                    </tr>
                    {expandedId === record.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="px-6 py-4">
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
                  record.type === "Income" 
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
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}

export default RecordsSection;