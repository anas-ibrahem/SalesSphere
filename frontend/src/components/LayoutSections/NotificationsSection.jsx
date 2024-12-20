import React, { useContext, useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
  Typography,
} from "@material-tailwind/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "../Pagination";
import fetchAPI from '../../utils/fetchAPI';
import { NotificationPriority, NotificationTypes } from "../../utils/Enums";
import { AccessTime, MilitaryTech, Paid, Person, Notifications, CrisisAlert, BusinessCenter, DoneAll, Done } from "@mui/icons-material";
import UserContext from "../../context/UserContext";

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
  const [filterType, setFilterType] = useState(-1);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const NotificationsPerPage = 10;

  const { notificationCount, fetchNotificationCount } = useContext(UserContext);


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
  }, [reload]);

    const MarkAsRead = (notification) => {
        if(notification.seen) return;
        const token = localStorage.getItem('token');
        fetchAPI(`/notification/seen/${notification.id}`, 'PATCH', null, token).then((data) => {
            console.log(data);
            setReload(!reload);
            fetchNotificationCount();
        }).catch((error) => {
            console.error("Error marking notification as read:", error);
        });
    };

    const MarkAllAsRead = () => {
        const token = localStorage.getItem('token');
        fetchAPI(`/notification/seen/all`, 'PATCH', null, token).then((data) => {
            console.log(data);
            setReload(!reload);
            fetchNotificationCount();
        }).catch((error) => {
            console.error("Error marking all notifications as read:", error);
        });
    };
            

  // Filtering logic
  const filterNotifications = notifications.filter((notification) => {
    return (
      (filterType == -1 || notification.type == filterType)
    );
  });



  // Pagination logic
  const indexOfLastNotification = currentPage * NotificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - NotificationsPerPage;
  const currentNotifications = filterNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );
  const totalPages = Math.ceil(filterNotifications.length / NotificationsPerPage);

  const manager = true;

  return (<section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Notifications {notificationCount > 0 && <span className="font-light text-lg">- You have {notificationCount} unread notifications</span>}</h1>
                <div className="flex space-x-2">
                  <button
                    onClick={MarkAllAsRead}
                    className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600 p-1 disabled:bg-gray-500" disabled={notificationCount === 0}
                  >
                    {notificationCount > 0 && <Done className="mr-2" /> || <DoneAll className="mr-2" />}
                    {notificationCount > 0 && <span className="text-lg">Mark all as read</span> || <span className="text-lg">All read</span>}
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
                  <option value={-1}>All Types</option>
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
                        className={`cursor-default my-2 hover:bg-gray-100 border border-gray-200 ${notification.priority === NotificationPriority.High ? 'bg-red-50' : ''} ${notification.seen ? 'bg-gray-100' : ''}`}
                        onClick={() => MarkAsRead(notification)}
                      >
                        <ListItemPrefix>
                            <Icon className={`text-secondary-accent m-2 ${notification.priority === NotificationPriority.High ? 'text-red-900' : ''}`} />
                        </ListItemPrefix>
                        <div>
                            <div className="flex items-center">
                                <Typography variant="h6" color="blue-gray">
                                    {notification.title}
                                </Typography>
                                <Typography variant="small" className="ml-2 text-gray-500 text-xs">
                                    {new Date(notification.date).toLocaleString().replace(/:\d{2}\s/,' ').replace(/,/, '')}
                                </Typography>
                                {
                                    notification.priority === NotificationPriority.High && <Typography variant="small" className="ml-2 text-red-900 text-xs italic">
                                        (High Priority)
                                </Typography>
                                }
                            </div>
                          
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            {notification.content}
                          </Typography>
                          
                        </div>

                        <div className="ml-auto">
                            <button
                                disabled={notification.seen}
                                onClick={() => MarkAsRead(notification)}
                                className="text-blue-500 hover:text-blue-700 disabled:text-gray-500"
                            >
                                {
                                    notification.seen ? <DoneAll className="mr-2" /> : <Done className="mr-2" /> 
                                }

                                {
                                    notification.seen ? 'Seen' : 'Mark as read'
                                }
                                
                            </button>
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
        );
}

export default NotificationsSection;