import { createContext, useEffect, useState } from "react";
import LoadingScreen from "../pages/LoadingScreen";
import fetchAPI from "../utils/fetchAPI";
import toast from 'react-hot-toast';

const UserContext = createContext(null);

const UserProvider = ({children, provideOther={}}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [tokenExpired, setTokenExpired] = useState(false);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);

    const fetchNotificationCount = () => {
      const _token = localStorage.getItem('token');
        fetchAPI('/notification/unread/count', 'GET', null, _token).then((data) => {
            console.log('Notification count:', data);
            setNotificationCount(data.count);
        }).catch((error) => {
            console.error('Error fetching notification count:', error);
        });
    }

    useEffect(() => {
        const _token = localStorage.getItem('token');
        console.log('Token:', _token);
        setToken(_token);
        setIsLoading(true);
        if(_token) {
          fetchAPI('/me', 'GET', null, _token).then(data => {
            if(data.id) {
              setIsAuthenticated(true);
              setEmployee(data);
              fetchNotificationCount();
            }
            else if(data.error) {
              if(data.session_end) {
                setTokenExpired(true);
                toast.error('Session expired. Please login again.', {icon: '🔒'});
              }
              else {
                toast.error(data.error);
              }
              
              setIsAuthenticated(false);
              localStorage.removeItem('token');
            }
            setIsLoading(false);
          }).catch(error => {
            setIsAuthenticated(false);
            setIsLoading(false);
            localStorage.removeItem('token');
          });
        }
        else {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }, [isAuthenticated]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <UserContext.Provider value={{isLoading, setIsLoading, isAuthenticated, setIsAuthenticated, employee, setEmployee, tokenExpired, setTokenExpired, token, setToken, notificationCount, fetchNotificationCount, ...provideOther}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;

export { UserProvider };