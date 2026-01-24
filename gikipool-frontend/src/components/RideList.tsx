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
  phone?: string;
}

const API_URL = "https://d848do806m.execute-api.ap-south-1.amazonaws.com";

export default function RideList() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/rides`);
      setRides(response.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setIsLoading(false);
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl h-full flex flex-col" style={{ border: '1px solid #DDDDDD' }}>
      <div className="px-8 py-6 flex items-center justify-between" style={{ borderBottom: '1px solid #EBEBEB' }}>
        <div>
          <h2 className="text-2xl font-semibold text-[#222222]">Available Rides</h2>
          <p className="text-sm text-[#717171] mt-1">{rides.length} ride{rides.length !== 1 ? 's' : ''} available</p>
        </div>
        
        <button 
          onClick={fetchRides}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          style={{ border: '1px solid #222222', color: '#222222' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F7F7F7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="px-8 py-6 flex-1 overflow-auto">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-6 animate-pulse" style={{ borderBottom: '1px solid #EBEBEB' }}>
                <div className="h-5 bg-[#EBEBEB] rounded-lg w-1/3 mb-4"></div>
                <div className="h-4 bg-[#F7F7F7] rounded-lg w-1/2 mb-3"></div>
                <div className="h-4 bg-[#F7F7F7] rounded-lg w-1/4"></div>
              </div>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#F7F7F7' }}>
              <svg className="w-8 h-8 text-[#717171]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#222222] mb-2">No rides available</h3>
            <p className="text-sm text-[#717171]">Be the first to create a ride.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {rides.map((ride, index) => (
              <div 
                key={ride.PK} 
                className="py-6"
                style={{ borderBottom: index !== rides.length - 1 ? '1px solid #EBEBEB' : 'none' }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#222222] mb-2">
                      {ride.destination}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <p className="text-sm text-[#717171]">{formatDate(ride.SK)}</p>
                      <p className="text-sm text-[#717171] truncate">Driver: {ride.driver}</p>
                      {ride.phone && (
                        <a href={`tel:${ride.phone}`} className="text-sm text-[#FF6B35] font-medium hover:underline">
                          {ride.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#222222]">PKR {ride.price}</p>
                      <p className="text-xs text-[#717171] mt-0.5">per seat</p>
                    </div>
                    
                    {user && user.signInDetails?.loginId === ride.driver && (
                      <button 
                        onClick={() => handleDelete(ride.PK)}
                        className="text-sm font-medium text-[#C13515] underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}