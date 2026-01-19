import { useState } from 'react';
import axios from 'axios';

export default function CreateRide() {
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    price: ''
  });

  const [status, setStatus] = useState(''); // To show success/error messages

  const handleSubmit = async (e: React.FormEvent) => { // <--- Make this async
    e.preventDefault();
    setStatus('Sending...');

    try {
      // 2. The API Call
      // REPLACE with your actual Terraform Output URL
      const apiUrl = "https://o8mmdman7b.execute-api.ap-south-1.amazonaws.com/create-ride";
      
      const response = await axios.post(apiUrl, {
        // We ensure the numbers are actually numbers, not strings
        destination: formData.destination,
        date: formData.date,
        price: Number(formData.price) 
      });

      console.log("Success:", response.data);
      setStatus('Ride created successfully! 🚗');
      
      // Optional: Clear form
      setFormData({ destination: '', date: '', price: '' });

    } catch (error) {
      console.error("Error:", error);
      setStatus('Failed to create ride. Check console.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">

      {/* Main Content Area */}
      <main className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Create a New Ride</h2>

        {/* The Form */}
        {/* Status Message */}
        {status && <p className="text-center text-sm font-bold mb-4 text-blue-600">{status}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Destination Input */}
          <div className="flex flex-col">
            <label htmlFor="destination" className="font-semibold text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              id="destination"
              placeholder="e.g. Islamabad Toll Plaza"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              required
            />
          </div>

          {/* Date Input */}
          <div className="flex flex-col">
            <label htmlFor="date" className="font-semibold text-gray-700 mb-1">Departure Date</label>
            <input
              type="datetime-local"
              id="date"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          {/* Price Input */}
          <div className="flex flex-col">
            <label htmlFor="price" className="font-semibold text-gray-700 mb-1">Price per Seat (PKR)</label>
            <input
              type="number"
              id="price"
              placeholder="e.g. 500"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
          >
            Publish Ride 🚀
          </button>
        </form>
      </main>
    </div>
  );
}