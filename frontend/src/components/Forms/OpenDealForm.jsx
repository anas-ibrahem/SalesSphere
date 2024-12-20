import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';
import fetchAPI from '../../utils/fetchAPI';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

const OpenDealForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerOptions, setCustomerOptions] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        due_date: '',
        expenses: '',
        customer_budget: '',
        customer_id: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchAPI('/customer', 'GET', null, token).then((data) => {
            setCustomerOptions(data);
        });
    }, []);

    const handleCustomerSearch = (e) => {
        const searchTerm = e.target.value;
        setCustomerSearch(searchTerm);
        setSelectedCustomer(null);
    };

    const handleCustomerSelect = (customer) => {
        setFormValues(prev => ({
            ...prev,
            customer_id: customer.id,
        }));
        setCustomerSearch(customer.name);
        setSelectedCustomer(customer);
    };

    const handleCustomerClear = () => {
        setCustomerSearch('');
        setSelectedCustomer(null);
        setFormValues(prev => ({
            ...prev,
            customer_id: '',
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate customer selection
        if (!selectedCustomer) {
            toast.error('Please select a customer from the suggested list');
            return;
        }

        const token = localStorage.getItem('token');
        fetchAPI('/deal', 'POST', formValues, token)
            .then(data => {
                toast.success('Deal added successfully');
                // Optional: Reset form or navigate away
            })
            .catch((error) => {
                toast.error('An error occurred. Please try again.');
            });
    };

    const handleAddCustomer = () => {
        navigate('/home/customers/add');
    };

    const filterCustomers = () => {
        if (!customerSearch) return [];

        const searchTermLower = customerSearch.toLowerCase();
        return customerOptions.filter(customer => 
            customer.name.toLowerCase().includes(searchTermLower) || 
            customer.email.toLowerCase().includes(searchTermLower)
        );
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
            <h2 className="text-center font-extrabold text-xl text-blue-800 mb-1">Open New Deal</h2>
            <form onSubmit={handleSubmit}>
                {/* Existing form fields */}
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
                    <label htmlFor="customer_budget" className="block mb-1 text-gray-600">Customer Budget *</label>
                    <input
                        type="number"
                        id="customer_budget"
                        name="customer_budget"
                        value={formValues.customer_budget}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="expenses" className="block mb-1 text-gray-600">Expenses *</label>
                    <input
                        type="number"
                        id="expenses"
                        name="expenses"
                        value={formValues.expenses}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>

                {/* Updated Customer Selection Section */}
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
                                placeholder="Search customer by name or email"
                                required
                                className="w-full p-2 border border-gray-300 rounded-md text-lg"
                            />
                            {!selectedCustomer && customerSearch && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                                    {filterCustomers().map((customer) => (
                                        <li 
                                            key={customer.id} 
                                            onClick={() => handleCustomerSelect(customer)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {customer.name} - {customer.email}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                            {/* Selected Customer Display */}
                            {selectedCustomer && (
                                <div className="flex items-center mt-2">
                                    <span className="mr-2 text-gray-700">
                                        {selectedCustomer.name} - {selectedCustomer.email}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={`flex items-center ${selectedCustomer ? '-mt-8' : ''}`}>
                            <button
                                type="button"
                                onClick={handleAddCustomer}
                                className="bg-green-500 text-white p-2 rounded-md flex items-center mr-2"
                                title="Add New Customer"
                            >
                                <FaPlus />
                            </button>
                            {selectedCustomer && (
                                <button
                                    type="button"
                                    onClick={handleCustomerClear}
                                    className="bg-red-500 text-white p-2 rounded-md flex items-center"
                                    title="Clear Customer Selection"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1 text-gray-600">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        required
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

export default OpenDealForm;