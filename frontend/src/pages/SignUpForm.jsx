import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../components/context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    setLoading(true);
    setError(false);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Add navigation handler
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={handleBackToHome}
          className="absolute top-4 left-4 p-3 flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200 rounded-lg hover:bg-white/50 backdrop-blur-sm z-20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/30">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Side - Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-sm mb-6">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-3xl font-semibold text-slate-800 mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-slate-600 text-base">
                    Sign in to your AssetPlus account
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-200" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white/80 ${
                          error ? 'border-red-300 bg-red-50' : 'border-slate-200'
                        }`}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-200" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white/80 ${
                          error ? 'border-red-300 bg-red-50' : 'border-slate-200'
                        }`}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-slate-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                      Invalid email or password. Please try again.
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-medium shadow-sm hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center pt-4">
                    <p className="text-slate-600 text-sm">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 hover:underline"
                      >
                        Create one here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Image/Illustration */}
            <div className="lg:w-1/2 bg-gradient-to-br from-slate-700 to-slate-800 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-16 h-16 border border-white rounded-full"></div>
                <div className="absolute top-32 right-16 w-8 h-8 border border-white rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 border border-white rounded-full"></div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 text-center text-white">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-3">AssetPlus</h2>
                  <p className="text-slate-200 text-base leading-relaxed">
                    Your complete asset management solution
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 text-left max-w-sm mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-slate-200 text-sm">Track all your assets in one place</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-slate-200 text-sm">Real-time monitoring and alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-slate-200 text-sm">Advanced reporting and analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-slate-200 text-sm">Secure and reliable platform</span>
                  </div>
                </div>

                {/* Simple Image Placeholder */}
                <div className="mt-8 p-6 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded"></div>
                  </div>
                  <p className="text-slate-300 text-xs">Dashboard Preview</p>
                </div>
              </div>

              {/* Subtle Floating Elements */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full"></div>
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/15 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/25 rounded-full"></div>
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