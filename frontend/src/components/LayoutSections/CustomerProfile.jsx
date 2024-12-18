import React, { useState, useContext , useEffect } from "react";
import { 
  Star, Medal, UserPlus, TrendingUp, BarChart2, List, X, User, UsersRound, 
  Trophy, Target, HandCoins, DollarSign, MapPin, Calendar, Flag, BookCheck, 
  Rocket, Clock, CheckCircle2, AlertCircle, Briefcase, Pencil 
} from "lucide-react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import fetchAPI from '../../utils/fetchAPI';
import { CustomerTypes } from "../../utils/Enums";
import { ContactTypes } from "../../utils/Enums";
import EditCustomerForm from "../Forms/EditCustomerForm";
import UserContext from "../../context/UserContext";
import { EmployeeRoles } from "../../utils/Enums";

const AddedByProfile = ({ addedBy }) => {
  const navigate = useNavigate();

  // Fallback profile picture if none exists
  const profilePicture = addedBy.profile_picture_url 
    ? addedBy.profile_picture_url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(addedBy.first_name + ' ' + addedBy.last_name)}`;

  const handleProfileClick = () => {
    navigate(`/home/employees/${addedBy.employee_id}`, { replace: false });
  };

  return (
    <div 
      onClick={handleProfileClick} 
      className="bg-gray-100 p-3 rounded-lg mt-2 flex items-center cursor-pointer hover:bg-gray-200 transition-colors"
    >
      <div className="mr-3 h-12 w-12 flex-shrink-0">
        <img
          src={profilePicture}
          alt={`${addedBy.first_name} ${addedBy.last_name}'s profile`}
          className="w-full h-full rounded-full object-cover object-center"
        />
      </div>
      <div>
        <p className="text-sm text-gray-700">
          <span className="font-medium">{addedBy.first_name} {addedBy.last_name}</span>
          <span className="ml-2 text-xs text-gray-500">
            ID: {addedBy.employee_id}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Contact: {addedBy.phone_number}
        </p>
      </div>
    </div>
  );
};

const CustomerProfile = ({ back }) => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { employee:me } = useContext(UserContext);


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchAPI(`/customer/${customerId}`, 'GET', null, token)
      .then((data) => {
        console.log(data);
        setCustomer(data);
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
      });
  }, [customerId , isEditing]);

  if (!customer) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Calculate customer registration duration
  const registrationDate = new Date(customer.registration_date);
  const yearsAsMember = Math.floor((new Date() - registrationDate) / (1000 * 60 * 60 * 24 * 365));

  const getCustomerType = (typeValue) => {
    return Object.keys(CustomerTypes).find(key => CustomerTypes[key] === typeValue) || "Unknown";
  };

  const handleEditClick = () => {
    setIsEditing(true);
    navigate('edit');
  };

  const handleBackFromEdit = () => {
    navigate('/home/customers/' + customerId);
    setIsEditing(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
            <div className="bg-white m-0 rounded shadow-xl w-full h-screen flex flex-col overflow-hidden">
              <div className="relative h-[120px] bg-gradient-to-r from-green-300 to-blue-500 flex-shrink-0">
                <button
                  onClick={back}
                  className="absolute top-6 left-6 inline-flex w-auto cursor-pointer 
                  select-none appearance-none items-center 
                  justify-center space-x-1 rounded border border-gray-200
                   bg-white px-3 py-2 text-sm font-medium text-gray-800 transition 
                   hover:border-gray-300 active:bg-white hover:bg-gray-100"
                >
                  Back
                </button>
                {(me.role === EmployeeRoles.Manager || me.id === customer.added_by.employee_id) && 
                    <button
                  onClick={handleEditClick}
                  className="absolute top-6 right-6 inline-flex w-auto cursor-pointer 
                  select-none appearance-none items-center 
                  justify-center space-x-1 rounded border border-gray-200
                   bg-white px-3 py-2 text-sm font-medium text-gray-800 transition 
                   hover:border-gray-300 active:bg-white hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </button> 
                }

              </div>
              
              <div className="flex-grow overflow-y-auto px-5 py-2 mt-3">
                <div className="flex flex-col gap-3 pb-6">
                  <div>
                    <h3 className="text-xl text-slate-900 relative font-bold leading-6">
                      {customer.name}
                    </h3>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>

                  <p className="text-sm text-stone-500">
                    {getCustomerType(customer.type)}
                  </p>

                  {/* Personal Information Section */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" /> Personal Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-lg font-bold">{customer.phone_number || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Registration Date</p>
                        <p className="text-lg font-bold">
                          {new Date(customer.registration_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Years as Customer</p>
                        <p className="text-lg font-bold">{yearsAsMember}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-lg font-bold">{customer.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Customer Information */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" /> Customer Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Lead Source</p>
                        <p className="text-lg font-bold">{customer.lead_source || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Preferred Contact Method</p>
                        <p className="text-lg font-bold">
                          {customer.preferred_contact_method === ContactTypes.Email ? 'Email' : 'Phone'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deals Summary Section */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-purple-600" /> Deals Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Open Deals</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {customer.open_deals_count}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Claimed Deals</p>
                        <p className="text-lg font-bold text-blue-600">
                          {customer.claimed_deals_count}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Closed Won Deals</p>
                        <p className="text-lg font-bold text-green-600">
                          {customer.closed_won_deals_count}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Closed Lost Deals</p>
                        <p className="text-lg font-bold text-red-600">
                          {customer.closed_lost_deals_count}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Added By Section */}
                  {customer.added_by && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-cyan-800" /> Added By
                      </h4>
                      <AddedByProfile addedBy={customer.added_by} />
                    </div>
                  )}
                </div>
              </div>
            </div>
        }
      />
      <Route
        path="/edit"
        element={<EditCustomerForm customer={customer} onBack={handleBackFromEdit} />}
      />
    </Routes>
  );
};

export default CustomerProfile;