import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';

interface Ride {
  PK: string;
  SK: string;
  destination: string;
  price: number;
  driver: string;
}

const API_URL = "https://q4ov0f7n07.execute-api.ap-south-1.amazonaws.com";

export default function RideList() {
  const [rides, setRides] = useState<Ride[]>([]);
  
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await axios.get(`${API_URL}/rides`);
      setRides(response.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const handleDelete = async (rideId: string) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      await axios.delete(`${API_URL}/rides/${rideId}`, {
        headers: {
          Authorization: token
        }
      });

      setRides(prevRides => prevRides.filter(ride => ride.PK !== rideId));
      
    } catch (error) {
      console.error("Error deleting ride:", error);
      alert("Failed to delete ride. You might not be the owner.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Rides 🚗</h2>
      
      {rides.length === 0 ? (
        <p className="text-gray-500">No rides available right now.</p>
      ) : (
        rides.map((ride) => (
          <div key={ride.PK} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex justify-between items-center">
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{ride.destination}</h3>
              <p className="text-gray-600">📅 Date: {ride.SK}</p>
              <p className="text-gray-600">👤 Driver: {ride.driver}</p>
              <p className="text-green-600 font-bold mt-2">Rs. {ride.price}</p>
            </div>

            {user && user.signInDetails?.loginId === ride.driver && (
              <button 
                onClick={() => handleDelete(ride.PK)}
                className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded transition"
              >
                Delete
              </button>
            )}

          </div>
        ))
      )}
    </div>
  );
}