import { useState } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function CreateRide() {
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    price: '',
    phone: ''
  });

  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setIsLoading(true);

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const apiUrl = "https://d848do806m.execute-api.ap-south-1.amazonaws.com/create-ride";
      
      const response = await axios.post(apiUrl, {
        destination: formData.destination,
        date: formData.date,
        price: Number(formData.price),
        phone: formData.phone
      }, {
        headers: {
          Authorization: token
        }
      });

      console.log("Success:", response.data);
      setStatus('success');
      
      setFormData({ destination: '', date: '', price: '', phone: '' });

    } catch (error) {
      console.error("Error:", error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl h-full flex flex-col" style={{ border: '1px solid #DDDDDD' }}>
      <div className="px-8 py-6" style={{ borderBottom: '1px solid #EBEBEB' }}>
        <h2 className="text-2xl font-semibold text-[#222222]">Offer a Ride</h2>
      </div>

      <div className="px-8 py-8 flex-1 flex flex-col">
        {status === 'success' && (
          <div className="mb-8 p-4 rounded-xl bg-[#F0FDF4] border border-[#86EFAC]">
            <p className="text-sm text-[#166534] font-medium">Ride created successfully!</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mb-8 p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
            <p className="text-sm text-[#991B1B] font-medium">Failed to create ride. Please try again.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[#222222] mb-6">Trip details</h3>
            
            <div className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden" style={{ border: '1px solid #DDDDDD' }}>
              <div className="p-5" style={{ borderRight: '1px solid #DDDDDD' }}>
                <label className="block text-xs text-[#717171] mb-1">Destination</label>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full text-base font-medium text-[#222222] bg-transparent outline-none placeholder:text-[#B0B0B0]"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  required
                />
              </div>
              
              <div className="p-5">
                <label className="block text-xs text-[#717171] mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full text-base font-medium text-[#222222] bg-transparent outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#222222] mb-6">Contact information</h3>
            
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #DDDDDD' }}>
              <div className="p-5">
                <label className="block text-xs text-[#717171] mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  className="w-full text-base font-medium text-[#222222] bg-transparent outline-none placeholder:text-[#B0B0B0]"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[#222222] mb-6">Price per seat</h3>
            
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #DDDDDD' }}>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <label className="block text-xs text-[#717171] mb-1">Amount</label>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-medium text-[#222222]">PKR</span>
                    <input
                      type="number"
                      placeholder="500"
                      className="w-32 text-base font-medium text-[#222222] bg-transparent outline-none placeholder:text-[#B0B0B0]"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#717171]">Suggested</p>
                  <p className="text-sm font-medium text-[#222222]">PKR 400 - 600</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[20px]"></div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#FF6B35' }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#E85A2B')}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
          >
            {isLoading ? 'Publishing...' : 'Publish Ride'}
          </button>
        </form>
      </div>

      <div className="px-8 py-5" style={{ borderTop: '1px solid #EBEBEB', backgroundColor: '#FAFAFA' }}>
        <p className="text-sm text-[#717171]">
          Your ride will be visible to all GIKI students.
        </p>
      </div>
    </div>
  );
}