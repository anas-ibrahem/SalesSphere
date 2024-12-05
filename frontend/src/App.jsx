import Home from "./pages/Home"
import { Navigate , Route , Routes } from "react-router-dom";
import Login from "./pages/Login";
import BusinessRegistration from "./pages/BusinessRegistration";
import { useEffect, useState } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import toast, { Toaster } from 'react-hot-toast';

import UserContext from './context/UserContext';



function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const _token = localStorage.getItem('token');
    setToken(_token);
    if(_token) {
      fetch('http://localhost:3000/api/auth/', {
        method: 'POST',
        headers: {
          'Authorization': _token
        }
      }).then(res => {
        if(res.status === 200) {
          setIsAuthenticated(true);
        }
        else {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return res.json();

      }).then(data => {
        if(data.id) {
          setEmployeeId(data.id);
        }
        else if(data.error && data.session_end) {
          setTokenExpired(true);
          toast.error('Session expired. Please login again.', {icon: '🔒'});
        }
        setIsLoading(false);
      });
    }
    else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <UserContext.Provider value={{isAuthenticated, setIsAuthenticated, employeeId, setEmployeeId, tokenExpired, setTokenExpired, token, setToken}}>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/business-registration" element={<BusinessRegistration />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;