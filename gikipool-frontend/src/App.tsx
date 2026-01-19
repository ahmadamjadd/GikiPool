import React from 'react';
import CreateRide from './components/CreateRide';
import RideList from './components/RideList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">GikiPool 🚙</h1>
          <p className="text-gray-600">Share a ride, save money.</p>
        </div>

        {/* Layout Container */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* Left Sidebar: Create Ride */}
          {/* Added 'md:border-r' for the vertical line and 'md:pr-8' for spacing */}
          <div className="w-full md:w-1/3 md:border-r md:border-gray-300 md:pr-8">
            <CreateRide />
          </div>

          {/* Right Feed: Ride List */}
          <div className="w-full md:w-2/3">
            <RideList />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;