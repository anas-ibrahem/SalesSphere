import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import EmployeeProfile from "./EmployeeProfile";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AddEmployeeForm from "../Forms/AddEmployeeForm";
import Pagination from "../Pagination";
import fetchAPI from '../../utils/fetchAPI';
import { EmployeeRoles, NotificationTypes } from "../../utils/Enums";
import { AccessTime, MilitaryTech, NotificationsOff, Paid, Person, Notifications, CrisisAlert, BusinessCenter } from "@mui/icons-material";

const NotificationIcons = {
    [NotificationTypes.BadgeAward]: MilitaryTech,
    [NotificationTypes.Customer]: Person,
    [NotificationTypes.Deal]: BusinessCenter,
    [NotificationTypes.Deadline]: AccessTime,
    [NotificationTypes.Finances]: Paid,
    [NotificationTypes.General]: Notifications,
    [NotificationTypes.Target]: CrisisAlert,

};

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const NotificationsPerPage = 10;
  const navigate = useNavigate();

  // Fetch notifications from API
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchAPI('/notification', 'GET', null, token)
      .then((data) => {
        console.log(data);
        setNotifications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
  }, []);

  const getNotificationType = (typeValue) => {
    return Object.keys(NotificationTypes).find(key => NotificationTypes[key] === typeValue) || "Unknown";
  };

  // Filtering logic
  const filterNotifications = notifications.filter((notification) => {
    const notificationType = getNotificationType(notification.type);
    return (
      (filterType === "All" || notificationType === filterType)
    );
  });



  // Pagination logic
  const indexOfLastEmployee = currentPage * NotificationsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - NotificationsPerPage;
  const currentNotifications = filterNotifications.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filterNotifications.length / NotificationsPerPage);

  const manager = true;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate("add")}
                    className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600 p-1"
                  >
                    <NotificationsOff className="mr-2" />
                    <span className="text-lg">Mark all as read</span>
                  </button>

                </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                {/* Type Filter */}
                <select
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="All">All Types</option>
                  {Object.entries(NotificationTypes).map(([typeName, val]) => (
                    <option key={val} value={val}>
                    {/* split name camel case */}
                    {typeName.replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notifications Table */}
            <div className="flex-grow overflow-y-auto">
              <Card>
                <List>
                  {loading ? (
                    <Typography variant="h6" color="blue-gray" className="text-center">
                      Loading...
                    </Typography>
                  ) : (
                    currentNotifications.map((notification) => {
                        const Icon = NotificationIcons[notification.type];
                        return (
                      <ListItem
                        key={notification.id}
                        className="cursor-default my-2 hover:bg-gray-100 border border-gray-200"
                        onClick={() => null}
                      >
                        <ListItemPrefix>
                            <Icon className="text-secondary-accent" />
                        </ListItemPrefix>
                        <div>
                            <div className="flex items-center">
                                <Typography variant="h6" color="blue-gray">
                                    {notification.title}
                                </Typography>
                                <Typography variant="small" className="ml-2 text-gray-500 text-xs">
                                    {new Date(notification.date).toLocaleString().replace(/:\d{2}\s/,' ').replace(/,/, '')}
                                </Typography>
                            </div>
                          
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            {notification.content}
                          </Typography>
                          
                        </div>
                      </ListItem>
                    )})
                  )}
                </List>
              </Card>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </section>
        }
      />
      <Route
        path=":employeeId"
        element={<EmployeeProfile back={() => navigate("/home/Notifications")} />}
      />
      <Route
        path="add"
        element={
          <AddEmployeeForm onBack={() => navigate("/home/Notifications")} />
        }
      />
      <Route
        path="addtarget"
        element={<AddEmployeeForm onBack={() => navigate("/home/Notifications")} />}
      />
    </Routes>
  );
}

export default NotificationsSection;