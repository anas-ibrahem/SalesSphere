import React, { useState } from "react";

// TODO add green and red colors for income and expense and + or - sign
// TODO fix the color blue across all sections
// TODO add a search bar to filter records by deal name
// TODO add time (clock)
// TODO use icons for prev and next buttons


// Generate dummy financial records
const generateDummyData = () => {
    const dummyRecords = [];
    const dealNames = ["Deal Alpha", "Deal Beta", "Deal Gamma", "Deal Delta"];
    for (let i = 1; i <= 50; i++) {
      dummyRecords.push({
        id: i,
        amount: (Math.random() * 1000 + 100).toFixed(2),
        transaction_date: new Date(2024, 10, i % 30 + 1).toISOString().slice(0, 10),
        type: i % 2 === 0 ? "Income" : "Expense",
        description: `Description of transaction ${i}`,
        payment_method: i % 3 === 0 ? "Bank Transfer" : i % 3 === 1 ? "Credit Card" : "Cash",
        deal_name: dealNames[i % dealNames.length], // Add deal name
      });
    }
    return dummyRecords;
  };
  
  const dummyData = generateDummyData();
  
  function RecordsSection () {
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [filterType, setFilterType] = useState("All");
    const [sortField, setSortField] = useState("transaction_date");
    const [sortOrder, setSortOrder] = useState("asc");
    const recordsPerPage = 10;
  
    // Filtering logic
    const filteredRecords = dummyData.filter((record) => {
      return filterType === "All" || record.type === filterType;
    });
  
    // Sorting logic
    const sortedRecords = [...filteredRecords].sort((a, b) => {
      if (sortField === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else {
        return sortOrder === "asc"
          ? new Date(a.transaction_date) - new Date(b.transaction_date)
          : new Date(b.transaction_date) - new Date(a.transaction_date);
      }
    });
  
    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  
    const handleExpand = (id) => {
      setExpandedId(expandedId === id ? null : id);
    };
  
    return (
      <section className="bg-white p-6 shadow-md h-screen flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Financial Records</h1>
  
        {/* Filter and Sort Controls */}
        <div className="flex justify-between mb-4">
          {/* Filter */}
          <div className="flex space-x-4">
            <select
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
  
            {/* Sort */}
            <select
              onChange={(e) => setSortField(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="transaction_date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
  
        {/* Records Table */}
        <div className="flex-grow overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Payment Method</th>
                <th className="border p-2">Deal Name</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <React.Fragment key={record.id}>
                  <tr className="hover:bg-gray-100 cursor-pointer" onClick={() => handleExpand(record.id)}>
                    <td className="border p-2 text-center">{record.id}</td>
                    <td className="border p-2 text-center">${record.amount}</td>
                    <td className="border p-2 text-center">{record.transaction_date}</td>
                    <td className="border p-2 text-center">{record.type}</td>
                    <td className="border p-2 text-center">{record.payment_method}</td>
                    <td className="border p-2 text-center">{record.deal_name}</td>
                  </tr>
                  {expandedId === record.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="border p-4">
                        <p><strong>Description:</strong> {record.description}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
  
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
  
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    );
  };

  export default RecordsSection;