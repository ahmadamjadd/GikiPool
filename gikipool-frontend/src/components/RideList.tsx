import { useState, useEffect } from 'react';
import axios from 'axios';

interface Ride {
  PK: string;
  SK: string;
  destination: string;
  price: number;
  driver: string;
}

export default function RideList() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    // 1. define the async logic or use .then syntax
    const fetchRides = async () => {
      try {
        // Replace with your specific API URL from Terraform output
        const response = await axios.get('https://o8mmdman7b.execute-api.ap-south-1.amazonaws.com/rides');
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, []); // <--- The empty array [] ensures this runs only once on mount

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Available Rides 🚗</h2>
      <div className="space-y-4">
        {rides.length === 0 ? (
          <p>Loading rides...</p>
        ) : (
          rides.map((ride) => (
            <div key={ride.PK} className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-bold text-lg">{ride.destination}</h3>
              <p className="text-gray-600">Driver: {ride.driver}</p>
              <p className="text-green-600 font-semibold">${ride.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}