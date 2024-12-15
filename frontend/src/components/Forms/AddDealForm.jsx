import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import fetchAPI from '../../utils/fetchAPI';
import { useNavigate } from 'react-router-dom'; // Ensure react-router is installed

const AddDealForm = ({ onBack }) => {
    const navigate = useNavigate(); // For navigation
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerOptions, setCustomerOptions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        due_date: '',
        expenses: '',
        customer_budget: '',
        customer_id: '',
    });

    useEffect(() => {
        // Fetch API Dealsdata from API
        const token = localStorage.getItem('token');
          fetchAPI('/customer', 'GET', null, token).then((data) => {
            setCustomerOptions(data);
            console.log(data);
          });
    
      } , []);

    // New state for customer search

    // Handle customer search input
    const handleCustomerSearch = async (e) => {
        const searchTerm = e.target.value;
        setCustomerSearch(searchTerm);
        setIsSearching(true);
        setIsSearching(false);
    };

    // Select a customer
    const handleCustomerSelect = (customer) => {
        setFormValues(prev => ({
            ...prev,
            customer_id: customer.id,
        }));
        setCustomerSearch(customer.name);
        setCustomerOptions([]);
    };

    // Existing change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formValues);
        const token = localStorage.getItem('token');
        fetchAPI('/deal', 'POST', formValues, token).then(data => {
            if(!data.error)
            {
                toast.success('Deal added successfully');
            }
            else
            {
                toast.error('Failed to add Deal');
            }
        });
    };

    // Navigate to add customer page
    const handleAddCustomer = () => {
        navigate('/home/customers/add');
    };

    return (
        <div className="bg-white p-6 shadow-md">
            <button 
                type="button" 
                onClick={onBack} 
                className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-center font-extrabold text-xl text-blue-800 mb-1">Add New Deal</h2>
            <form onSubmit={handleSubmit}>
                {/* Existing form fields... */}
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-1 text-gray-600">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="due_date" className="block mb-1 text-gray-600">Due Date *</label>
                    <input
                        type="date"
                        id="due_date"
                        name="due_date"
                        value={formValues.due_date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="expenses" className="block mb-1 text-gray-600">Expenses *</label>
                    <input
                        type="text"
                        id="expenses"
                        name="expenses"
                        value={formValues.expenses}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                {/* New Customer Selection Section */}
                <div className="mb-4 relative">
                    <label htmlFor="customer" className="block mb-1 text-gray-600">Customer *</label>
                    <div className="flex items-center">
                        <div className="relative w-full mr-2">
                            <input
                                type="text"
                                id="customer"
                                name="customer"
                                value={customerSearch}
                                onChange={handleCustomerSearch}
                                placeholder="Search customer by name"
                                required
                                className="w-full p-2 border border-gray-300 rounded-md text-lg"
                            />
                            {isSearching && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    Searching...
                                </div>
                            )}
                            {customerOptions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                                    {customerOptions.map((customer) => 
                                        {
                                            if (customer.name.toLowerCase().includes(customerSearch.toLowerCase()))
                                            return (
                                            <li 
                                                key={customer.id} 
                                                onClick={() => handleCustomerSelect(customer)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {customer.name} - {customer.email}
                                            </li>
                                            );
                                        }
                                    )}
                                </ul>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddCustomer}
                            className="bg-green-500 text-white p-2 rounded-md flex items-center"
                            title="Add New Customer"
                        >
                            <FaPlus />
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1 text-gray-600">Description (Optional)</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="text-center mt-5">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md text-lg shadow-md"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDealForm;