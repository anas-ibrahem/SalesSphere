import React, { useState, useContext, useEffect } from "react";
import { 
  Star, Medal, UserPlus, TrendingUp, BarChart2, List, X, User, UsersRound, 
  Trophy, Target, HandCoins, DollarSign, MapPin, Calendar, Flag, BookCheck, 
  Rocket, Clock, CheckCircle2, AlertCircle, Briefcase, Pencil, ArrowUpDown
} from "lucide-react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import fetchAPI from '../../utils/fetchAPI';
import { EmployeeRoles } from "../../utils/Enums";
import DetailModal from "./DetailModal";
import { BadgeIcons, TargetIcons } from "../../utils/Enums";
import EditEmployeeForm from "../Forms/EditEmployeeForm";
import UserContext from "../../context/UserContext";

const ProgressBar = ({ progress, color = "blue" }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
    <div 
      className={`bg-${color}-600 h-2.5 rounded-full`}
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);

const EmployeeProfile = ({ back }) => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [targetSortOrder, setTargetSortOrder] = useState('asc');
  const navigate = useNavigate();
  const { employee: me } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchAPI(`/employee/summary/${employeeId}`, 'GET', null, token)
      .then((data) => {
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Error fetching employee details:", error);
      });
  }, [employeeId]);

  if (!employee) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const totalDeals = 
    (employee.deals?.closed_won_deals_count || 0) + 
    (employee.deals?.closed_lost_deals_count || 0);

  const successRate = totalDeals > 0 
    ? ((employee.deals?.closed_won_deals_count || 0) / totalDeals * 100).toFixed(2)
    : '0.00';

  const openBadgeModal = () => {
    setModalData(employee.badges);
    setActiveModal('badges');
  };

  const openTargetModal = () => {
    setModalData(employee.targets);
    setActiveModal('targets');
  };

  const profilePicture = employee.profile_picture_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.first_name)}+${encodeURIComponent(employee.last_name)}`;

  const handleEditClick = () => {
    setIsEditing(true);
    navigate('edit');
  };

  const handleBackFromEdit = () => {
    navigate('/home/employees/' + employeeId);
    setIsEditing(false);
  };

  const toggleTargetSort = () => {
    setTargetSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedTargets = employee.targets ? [...employee.targets].sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);
    return targetSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  }) : [];

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="bg-white m-0 rounded shadow-xl w-full h-screen flex flex-col overflow-hidden">
            {/* Modals */}
            {activeModal === 'badges' && (
              <DetailModal 
                title="Badges Details" 
                data={modalData} 
                onClose={() => setActiveModal(null)} 
                type="badge"
              />
            )}
            {activeModal === 'targets' && (
              <DetailModal 
                title="Targets Details" 
                data={modalData} 
                onClose={() => setActiveModal(null)} 
                type="target"
              />
            )}

            {/* Header Section */}
            <div className="relative h-[120px] bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0">
              <button
                onClick={back}
                className="absolute top-6 left-6 inline-flex items-center justify-center space-x-1 rounded border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100"
              >
                Back
              </button>
              {(me.role === EmployeeRoles.Manager || me.id == employeeId) && (
                <button
                  onClick={handleEditClick}
                  className="absolute top-6 right-6 inline-flex items-center justify-center space-x-1 rounded border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </button>
              )}
              <div className="absolute bottom-[-45px] left-5 h-[90px] w-[90px] shadow-md rounded-full border-4 border-white overflow-hidden">
                <img
                  src={profilePicture}
                  alt={`${employee.first_name} ${employee.last_name}'s profile`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow overflow-y-auto px-5 py-2 mt-12">
              <div className="flex flex-col gap-3 pb-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-xl text-slate-900 font-bold leading-6">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                </div>

                <p className="text-sm text-stone-500">
                  {employee.role === EmployeeRoles.DealOpener && "Deal Opener"}
                  {employee.role === EmployeeRoles.DealExecutor && "Deal Executor"}
                  {employee.role === EmployeeRoles.Manager && "Manager"}
                </p>

                {/* Badges Section */}
              <div className="mt-4">
                  <h4 className="text-md font-medium flex items-center gap-2">
                    <Medal className="w-5 h-5 text-yellow-600" /> Badges
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {employee.badges && employee.badges.length > 0 ? (
                      employee.badges.map((badge, index) => {
                        const BadgeIcon = BadgeIcons[badge.type] || Star;
                        return (
                          <div 
                            key={index} 
                            onClick={openBadgeModal}
                            className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-200 transition"
                          >
                            <BadgeIcon className="w-4 h-4 text-blue-500" />
                            {badge.name}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No badges earned yet</p>
                    )}
                  </div>
                </div>


                {/* Targets Section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-purple-600" /> Targets
                    </h4>
                    <button
                      onClick={toggleTargetSort}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      Sort by deadline
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {sortedTargets.length > 0 ? (
                      sortedTargets.map((target, index) => {
                        const TargetIcon = TargetIcons[target.type] || Target;
                        const daysUntilDeadline = Math.ceil((new Date(target.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysUntilDeadline < 0;
                        
                        return (
                          <div 
                            key={index}
                            onClick={openTargetModal}
                            className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <TargetIcon className="w-5 h-5 text-purple-500" />
                              <span className="font-medium">{target.description}</span>
                            </div>
                            <ProgressBar progress={target.progress || 0} color="purple" />
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                              <span>Progress: {target.progress || 0}%</span>
                              <span className={isOverdue ? "text-red-500" : ""}>
                                Deadline: {new Date(target.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No targets set</p>
                    )}
                  </div>
                </div>
          {/* Personal Information Section */}
          <div className="mt-4">
            <h4 className="text-md font-medium flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" /> Personal Details
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-lg font-bold">{employee.phone_number || 'N/A'}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Birth Date</p>
                <p className="text-lg font-bold">
                  {employee.birth_date 
                    ? new Date(employee.birth_date).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Hire Date</p>
                <p className="text-lg font-bold">
                  {employee.hire_date 
                    ? new Date(employee.hire_date).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-lg font-bold">{employee.address || 'N/A'}</p>
              </div>
            </div>
          </div>

              {/* Deals Section */}
              <div className="mt-4">
                <h4 className="text-md font-medium flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" /> Related Deals
                </h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Total Deals</p>
                    <p className="text-lg font-bold">{totalDeals}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Success Rate</p>
                    <p className="text-lg font-bold">{successRate}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Open Deals</p>
                    <p className="text-lg font-bold">{employee.deals?.open_deals_count || 0}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Closed Won</p>
                    <p className="text-lg font-bold">{employee.deals?.closed_won_deals_count || 0}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Closed Lost</p>
                    <p className="text-lg font-bold">{employee.deals?.closed_lost_deals_count || 0}</p>
                  </div>
                </div>
              </div>
                  {/* Customers Section */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium flex items-center gap-2">
                      <UsersRound className="w-5 h-5 text-cyan-800" /> Customers
                    </h4>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Total Customers</p>
                        <p className="text-lg font-bold">{employee.customers?.customers_count || 0}</p>
                      </div>
                    </div>
                  </div>
                  
          
              </div>
            </div>
          </div>
        }
      />
      <Route
        path="/edit"
        element={<EditEmployeeForm employee={employee} onBack={handleBackFromEdit} />}
      />
    </Routes>
  );
};

export default EmployeeProfile;