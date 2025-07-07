import React, { useState } from 'react';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
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

    const { fullName, email, password } = formData;

    if (!fullName || !email || !password) {
      setError(true);
      return;
    }

    setLoading(true);

    try {
      // Simulate async signup (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Account created successfully!');
      // Reset form
      setFormData({ fullName: '', email: '', password: '' });
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
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
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@company.com"
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
              'Sign Up'
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
