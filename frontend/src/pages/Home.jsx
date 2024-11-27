import NavBar from "../components/NavBar";
import { Button } from '@mui/material'; // Import Material UI Button

function Home() {
  return (
    <div className="  h-screen w-screen bg-gray-100">
        <NavBar />
      {/* Tailwind styled heading */}
      <h1 className="text-xl text-blue-600 mb-8">Home</h1>
      
      {/* Material UI Button */}
      <Button variant="contained" color="primary">
        Test Material UI Button
      </Button>
    </div>
  );
}

export default Home;
