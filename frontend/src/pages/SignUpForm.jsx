import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeft } from 'lucide-react'; // Add this import
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!agreeToTerms) {
    //   toast.warning('Please agree to receive updates and special offers');
    //   return;
    // }

    const { email, password } = formData;
    setLoading(true);
    setError(false);
    
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.token) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        
        // Show success message
        toast.success('Login successful!');
        
        // Reset form
        // setFormData({ email: '', password: '' });
        // setAgreeToTerms(false);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add navigation handler
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-md flex items-center justify-center px-4 py-8 relative">
      {/* Add back button */}
      

      <div className="max-w-6xl w-full">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
                 <button 
                    onClick={handleBackToHome}
                   className="absolute top-4 left-4 p-2 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                     >
                    <ArrowLeft className="w-6 h-6 mr-1" />
                   <span className="text-sm font-medium">Back to Home</span>
                  </button>
              <div className="max-w-md mx-auto mt-5">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h1>
                <p className="text-gray-600 mb-8">
                  Don't have an account?{' '}
                  <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                    Register here
                  </a>
                </p>

                <div className="space-y-6">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email id</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors duration-200 ${
                          error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="Enter your email here"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors duration-200 ${
                          error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="Enter your password here"
                        required
                      />
                    </div>

                    {/* <div className="flex items-start space-x-3 mt-4">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="terms" className="text-sm mt-1 text-gray-600">
                        By Signing up you agree to receive updates and special Offers.
                      </label>
                    </div> */}

                    {error && (
                      <div className="text-red-500 text-sm mb-4">
                        Invalid email or password. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-fit bg-blue-950 text-white py-3 px-6 mt-10 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </div>
                      ) : (
                        'Sign in'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="lg:w-1/2 bg-white/30 backdrop-blur-sm p-8 lg:p-12 flex items-center justify-center">
              <div className="max-w-md w-full">
                {/* Modern Illustration */}
                <div className="relative">
                  <svg viewBox="0 0 400 350" className="w-full h-auto">
                    {/* Background Elements */}
                    <defs>
                      <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1E40AF" />
                      </linearGradient>
                      <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EFF6FF" />
                        <stop offset="100%" stopColor="#DBEAFE" />
                      </linearGradient>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1E40AF" floodOpacity="0.2"/>
                      </filter>
                    </defs>

                    {/* Floating Elements */}
                    <circle cx="80" cy="60" r="6" fill="#60A5FA" opacity="0.6">
                      <animate attributeName="cy" values="60;50;60" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="350" cy="100" r="4" fill="#34D399" opacity="0.7">
                      <animate attributeName="cy" values="100;90;100" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="320" cy="50" r="8" fill="#F59E0B" opacity="0.5">
                      <animate attributeName="cy" values="50;40;50" dur="4s" repeatCount="indefinite"/>
                    </circle>

                    {/* Phone Device */}
                    <rect x="140" y="80" width="120" height="220" rx="20" fill="url(#phoneGradient)" filter="url(#shadow)"/>
                    <rect x="150" y="100" width="100" height="180" rx="10" fill="url(#screenGradient)"/>
                    
                    {/* Phone Screen Content */}
                    <rect x="160" y="120" width="80" height="4" rx="2" fill="#3B82F6" opacity="0.3"/>
                    <rect x="160" y="130" width="60" height="4" rx="2" fill="#3B82F6" opacity="0.3"/>
                    <rect x="160" y="140" width="70" height="4" rx="2" fill="#3B82F6" opacity="0.3"/>
                    
                    {/* Profile Icon */}
                    <circle cx="200" cy="170" r="15" fill="#3B82F6" opacity="0.8"/>
                    <circle cx="200" cy="165" r="5" fill="white"/>
                    <path d="M190 180 Q200 175 210 180" stroke="white" strokeWidth="2" fill="none"/>

                    {/* Person Character */}
                    <g transform="translate(280, 150)">
                      {/* Body */}
                      <ellipse cx="0" cy="50" rx="25" ry="35" fill="#3B82F6"/>
                      {/* Head */}
                      <circle cx="0" cy="0" r="20" fill="#FED7AA"/>
                      {/* Hair */}
                      <path d="M-18 -8 Q0 -25 18 -8 Q15 -20 0 -20 Q-15 -20 -18 -8" fill="#1F2937"/>
                      {/* Eyes */}
                      <circle cx="-6" cy="-3" r="2" fill="#1F2937"/>
                      <circle cx="6" cy="-3" r="2" fill="#1F2937"/>
                      {/* Smile */}
                      <path d="M-8 5 Q0 12 8 5" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
                      {/* Arms */}
                      <ellipse cx="-30" cy="40" rx="8" ry="20" fill="#FED7AA" transform="rotate(-20)"/>
                      <ellipse cx="30" cy="40" rx="8" ry="20" fill="#FED7AA" transform="rotate(20)"/>
                      {/* Hand pointing to phone */}
                      <circle cx="-35" cy="25" r="6" fill="#FED7AA"/>
                      
                      <animateTransform 
                        attributeName="transform" 
                        attributeType="XML" 
                        type="translate"
                        values="280,150; 280,145; 280,150"
                        dur="3s" 
                        repeatCount="indefinite"/>
                    </g>

                    {/* Additional UI Elements */}
                    <g opacity="0.6">
                      <rect x="50" y="200" width="60" height="8" rx="4" fill="#10B981"/>
                      <rect x="50" y="220" width="40" height="8" rx="4" fill="#F59E0B"/>
                    </g>

                    {/* Checkmark Animation */}
                    <g transform="translate(180, 250)">
                      <circle r="15" fill="#10B981" opacity="0.9"/>
                      <path d="M-6 0 L-2 4 L6 -4" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <animate attributeName="stroke-dasharray" values="0 20; 20 20" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" values="20; 0" dur="2s" repeatCount="indefinite"/>
                      </path>
                    </g>
                  </svg>
                </div>

                {/* Text content below illustration */}
                <div className="text-center mt-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to AssetPlus</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Join thousands of users who trust AssetPlus for their digital asset management. 
                    Create your account today and start your journey!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignUpForm;