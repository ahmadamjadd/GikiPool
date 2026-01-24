import CreateRide from './components/CreateRide';
import RideList from './components/RideList';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <Authenticator 
      loginMechanisms={['email']}
      signUpAttributes={['name', 'phone_number']}
    >
      {({ signOut, user }) => (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFF8F3' }}>
          <header style={{ backgroundColor: '#1E1E2E', color: 'white' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B35' }}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold">
                    <span className="text-white">Giki</span>
                    <span style={{ color: '#FF6B35' }}>Pool</span>
                  </h1>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#FF6B35' }}>
                      {(user?.signInDetails?.loginId || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 max-w-[180px] truncate">
                      {user?.signInDetails?.loginId || user?.username}
                    </span>
                  </div>
                  
                  <button 
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: 'rgba(255,107,53,0.2)', color: '#FF6B35' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Your Ride, Your Choice
              </h2>
              <p className="text-white/90 text-base">
                Connect with fellow GIKI students for safe and affordable rides
              </p>
            </div>
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-8 h-full" style={{ minHeight: 'calc(100vh - 280px)' }}>
              <div className="flex flex-col">
                <CreateRide />
              </div>

              <div className="flex flex-col">
                <RideList />
              </div>
            </div>
          </main>

          <footer style={{ backgroundColor: '#1E1E2E' }} className="py-5">
            <p className="text-center text-gray-400 text-sm">
              © 2026 GikiPool - Made for GIKI Students
            </p>
          </footer>
        </div>
      )}
    </Authenticator>
  );
}

export default App;