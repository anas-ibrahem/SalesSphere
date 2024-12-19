import React, { useState, useEffect, useContext } from 'react'; 
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import fetchAPI from '../../utils/fetchAPI';
import { EmployeeRoles } from '../../utils/Enums.js';
import { toast } from 'react-hot-toast';
import UserContext from "../../context/UserContext";

// id SERIAL PRIMARY KEY,
// name VARCHAR(255) NOT NULL,
// registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
// phone_number VARCHAR(255) NOT NULL,
// email VARCHAR(255) NOT NULL UNIQUE,
// city VARCHAR(255),
// country VARCHAR(255) NOT NULL,
// street VARCHAR(255),
// website_url VARCHAR(255),
// industry VARCHAR(255) NOT NULL,
// -- Document URLs
// managerid_card_url VARCHAR(255),
// manager_personal_photo_url VARCHAR(255),
// business_logo_url VARCHAR(255),


const EditBusinessForm = ({onBack}) => {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        registration_date : '',
        phone_number: '',
        city: '',
        country: '',
        street: '',
        website_url: '',
        industry: '',
        business_logo_url: ''
    });
    const [profilePreview, setProfilePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [business, setBusiness] = useState(null);
    const { employee: me } = useContext(UserContext);
    
    const cloudName = import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

    useEffect(() => {
        // Request to get business details of me only if i am manager
        const token = localStorage.getItem('token');
        fetchAPI(`/business/${me.business_id}`, 'GET' , null, token)
            .then(data => {
                if(data.error) {
                    toast.error('An error occurred. Please try again.');
                }
                else {
                    setBusiness(data);
                    setFormValues(data);
                }
            })
            .catch((error) => {
                toast.error('An error occurred. Please try again.');
            });
    }, [me]);

    useEffect(() => {     
        if (business) {
            const formatDate = (dateString) => {
                if (!dateString) return '';
                return new Date(dateString).toISOString().split('T')[0];
            };

            setFormValues({
                name: business.name || '',
                email: business.email || '',
                registration_date: formatDate(business.registration_date) || '',
                phone_number: business.phone_number || '',
                city: business.city || '',
                country: business.country || '',
                street: business.street || '',
                website_url: business.website_url || '',
                industry: business.industry || '',
                business_logo_url: business.business_logo_url || ''
            });

            // Set initial profile picture preview if exists
            if (business.business_logo_url) {
                setProfilePreview(business.business_logo_url);
            }
        }
    }, [business]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };
    
    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB
    
            if (!validTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a JPEG or PNG.');
                return;
            }
    
            if (file.size > maxSize) {
                toast.error('File is too large. Maximum size is 5MB.');
                return;
            }
    
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
            if (!cloudName || !uploadPreset) {
                toast.error('Cloudinary configuration is missing. Please check your .env file.');
                return;
            }
    
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
    
            setUploading(true);
            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
    
                const data = await response.json();
    
                if (data.secure_url) {
                    setProfilePreview(data.secure_url);
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        profile_picture_url: data.secure_url,
                    }));
                    console.log(data.secure_url);
                    toast.success('Profile picture uploaded successfully.');
                } else {
                    toast.error('Failed to upload profile picture.');
                }
            } catch (error) {
                toast.error('An error occurred while uploading the profile picture.');
                console.error(error);
            } finally {
                setUploading(false);
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = { ...formValues };
        const token = localStorage.getItem('token');
        console.log(formData);
        try {
            const data = await fetchAPI('/employee/' + employee.id, 'PATCH', formData, token);
            if(data.error) {
            toast.error('An error occurred. Please try again.');
            }
            else  toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-6 shadow-md">
            {onBack && <button 
                type="button" 
                onClick={onBack} 
                className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>}
            <h2 className="text-center font-extrabold text-xl text-blue-800 mb-1">Edit Business</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                {/* Business Logo Upload */}
                <div className="mb-4 flex flex-col items-center">
                    <div className="w-32 h-32 mb-4 relative">
                        {profilePreview ? (
                            <img 
                                src={profilePreview} 
                                alt="Profile Preview" 
                                className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>
                    
                    <label className={`bg-blue-500 text-white py-2 px-4 rounded-md text-lg shadow-md flex items-center cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <FaUpload className="mr-2" /> {uploading ? 'Uploading...' : 'Upload Profile Picture'}
                        <input 
                            type="file" 
                            name="logo_picture"
                            accept="image/jpeg,image/png"
                            onChange={handleLogoChange}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                        Max 5MB (JPEG, PNG)
                    </p>
                </div>
                

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
                    <label htmlFor="city" className="block mb-1 text-gray-600">City *</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formValues.city}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="country" className="block mb-1 text-gray-600">Country *</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formValues.country}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="street" className="block mb-1 text-gray-600">Street *</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        value={formValues.street}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="industry" className="block mb-1 text-gray-600">Industry *</label>
                    <input
                        type="text"
                        id="industry"
                        name="industry"
                        value={formValues.industry}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="website_url" className="block mb-1 text-gray-600">Website URL *</label>
                    <input
                        type="text"
                        id="website_url"
                        name="website_url"
                        value={formValues.website_url}
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
                    <label htmlFor="reg" className="block mb-1 text-gray-600">Registration Date *</label>
                    <input
                        type="date"
                        id="registration_date"
                        name="registration_date"
                        value={formValues.registration_date}
                        onChange={handleChange}
                        required
                        className={`w-full p-2 border border-gray-300 rounded-md text-lg `}
                    />
                </div>

                
                <div className="mb-4">
                    <label htmlFor="phone_number" className="block mb-1 text-gray-600">Phone Number *</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formValues.phone_number}
                        onChange={(e) => { 
                            const { name, value } = e.target;
                            const phoneNumberPattern = /^[0-9+\-() ]*$/;
                            if (phoneNumberPattern.test(value)) {
                                handleChange(e);
                            }
                        }}
                        required
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

export default EditBusinessForm;
