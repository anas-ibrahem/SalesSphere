import Home from "./pages/Home"
import { Navigate, Route , Routes } from "react-router-dom";

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        {/* <Toaster /> */}
    </div>
  )
}

export default App
