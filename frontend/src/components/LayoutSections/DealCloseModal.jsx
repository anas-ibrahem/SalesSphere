import React from 'react';

const DealCloseModal = ({ isOpen, onClose, onConfirm, dealStatus}) => {
  if (!isOpen) return null;
  
  const statusText = dealStatus === 2 ? "won" : "lost";
  
return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                    Confirm Deal Closure
                </h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to mark this deal as <strong>{statusText}</strong>? This action cannot be undone.
                </p>
                <p className="text-gray-600 mb-6">
                    Remember to add any needed  <strong>Financial record</strong> for this deal to keep track of the finances.
                </p>
                
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
);
};

export default DealCloseModal;