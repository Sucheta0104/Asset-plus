import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Uncomment if you want to use toast notifications

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
   email: '',
    password: '',
  });

  const [loading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {email, password } = formData;
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email , password });
      if(response.status === 200) {
        toast.success('Login successful!'); // Show success message
        navigate('/dashboard'); // Redirect to dashboard after successful signup

      }
    } catch (error) {
      console.error('Signup error:', error);
    }

    
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className={`max-w-md w-full bg-white p-8 rounded-lg shadow-md transition duration-300 ${error ? 'animate-shake border-red-500 border' : ''}`}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg mb-2"></div>
          <h1 className="text-2xl font-bold text-gray-800">AssetPlus</h1>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error.email ? 'border-red-500 animate-shake' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        </div>
    </div>
  );
};

export default SignUpForm;
