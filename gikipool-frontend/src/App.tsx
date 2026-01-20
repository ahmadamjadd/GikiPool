import React from 'react';
import CreateRide from './components/CreateRide';
import RideList from './components/RideList';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    // We added configuration here 👇
    <Authenticator 
      loginMechanisms={['email']}
      signUpAttributes={['name', 'phone_number']}
    >
      {({ signOut, user }) => (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-extrabold text-blue-600">GikiPool 🚙</h1>
                {/* We use user.attributes.email because user.username is now the UUID */}
                <p className="text-gray-600">Welcome, {user?.attributes?.email || user?.username}!</p>
              </div>
              
              <button 
                onClick={signOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>

            {/* Layout */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full md:w-1/3 md:border-r md:border-gray-300 md:pr-8">
                <CreateRide />
              </div>

              <div className="w-full md:w-2/3">
                <RideList />
              </div>
            </div>

          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;