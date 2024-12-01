import Home from "./pages/Home"
import { Navigate , Route , Routes } from "react-router-dom";
import Login from "./pages/Login";
import BusinessRegistration from "./pages/BusinessRegistration";
import { useState } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import { Toaster } from 'react-hot-toast';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 500); // Simulate a 3 second loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div>
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
        {/* <Toaster /> */}
    </div>
  );
}

export default App;