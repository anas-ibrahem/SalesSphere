import { Link } from 'react-router-dom'; // Ensure you import this if using React Router

function ProfileModal({ profile, onClose }) {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        
        <div className="flex flex-col items-center">
          {profile.photo ? (
            <img 
              src={profile.photo} 
              alt={profile.name} 
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4">
              <User className="text-6xl text-gray-500" />
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
          <p className="text-gray-600 mb-4">{profile.role}</p>
          
          <div className="w-full text-left">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            
            <h3 className="font-semibold mt-4 mb-2">Department</h3>
            <p>{profile.department}</p>
          </div>

          {/* Button to redirect to detailed profile */}
          <Link 
            to={`/profile/${profile.id}`} // Use a dynamic route based on profile ID or unique identifier
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Detailed Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
