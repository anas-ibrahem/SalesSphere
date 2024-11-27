import Home from "./pages/Home"
import { Route , Routes } from "react-router-dom";
import Login from "./pages/Login";
import BusinessRegistration from "./pages/BusinessRegistration";
import { useState } from "react";
import LoadingScreen from "./pages/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 3000); // Simulate a 3 second loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/business-registration" element={<BusinessRegistration />} />
        </Routes>
        {/* <Toaster /> */}
    </div>
  )
}

export default App
