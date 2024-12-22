import React from 'react';

// Example usage: 
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />


function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="p-4 px-6 bg-white border-t flex justify-between items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="flex space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
