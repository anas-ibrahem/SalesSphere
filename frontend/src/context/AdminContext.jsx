import { createContext, useEffect, useState } from "react";
import LoadingScreen from "../pages/LoadingScreen";
import fetchAPI from "../utils/fetchAPI";
import toast from 'react-hot-toast';

const AdminContext = createContext(null);

const AdminProvider = ({children, provideOther={}}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [tokenExpired, setTokenExpired] = useState(false);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const _token = localStorage.getItem('admin_token');
        console.log('Token:', _token);
        setToken(_token);
        if(_token) {
          fetchAPI('/admin/me', 'GET', null, _token).then(data => {
            if(data.id) {
              setIsAuthenticated(true);
              setAdmin(data);
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
      }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <AdminContext.Provider value={{isLoading, setIsLoading, isAuthenticated, setIsAuthenticated, admin, setAdmin, tokenExpired, setTokenExpired, token, setToken, ...provideOther}}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminContext;

export { AdminProvider };