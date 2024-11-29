import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
      {/* <Toaster /> */}
    </div>
  );
}

export default App;
