import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import  { CustomerTypes , ContactTypes } from '../../utils/Enums.js'
import fetchAPI from '../../utils/fetchAPI';
import toast from 'react-hot-toast';

const AddCustomerForm = ({ onBack }) => {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        phone_number: '',
        lead_source: '',
        type: '', // Individual 0 or Company 1
        address: '',
        preferred_contact_method: '' // 0 for email, 1 for phone
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formValues);
        const token = localStorage.getItem('token');
        fetchAPI('/customer' , 'PUT' , formValues , token).then(data => {
        if(!data.error)
        {
            toast.success('Customer added successfully');
        }
        else
        {
            toast.error('Failed to add customer');
        }


        });
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
            <h2 className="text-center font-extrabold text-xl text-blue-800 mb-1">Add New Customer</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1 text-gray-600">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-gray-600">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone_number" className="block mb-1 text-gray-600">Phone Number *</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formValues.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="type" className="block mb-1 text-gray-600">Type *</label>
                    <select
                        id="type"
                        name="type"
                        value={formValues.type}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    >
                        <option value="">Select Type</option>
                        <option value= {CustomerTypes.Individual}>Individual</option>
                        <option value= {CustomerTypes.Company}>Company</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="lead_source" className="block mb-1 text-gray-600">Lead Source *</label>
                    <input
                        type="text"
                        id="lead_source"
                        name="lead_source"
                        value={formValues.lead_source}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="preferred_contact_method" className="block mb-1 text-gray-600">Preferred Contact Method *</label>
                    <select
                        id="preferred_contact_method"
                        name="preferred_contact_method"
                        value={formValues.preferred_contact_method}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    >
                        <option value="">Select Contact Method</option>
                        <option value= {ContactTypes.Email}>Email</option>
                        <option value= {ContactTypes.Phone}>Phone</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block mb-1 text-gray-600">Address (Optional)</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formValues.address}
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

export default AddCustomerForm;
