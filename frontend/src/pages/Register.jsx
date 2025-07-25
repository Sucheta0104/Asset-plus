import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Building, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
    
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.length < 2) return 'Full name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name can only contain letters and spaces';
        return '';

      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';

      case 'phone':
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[\+]?[1-9][\d]{9,15}$/;
        return !phoneRegex.test(value.replace(/\s/g, '')) ? 'Please enter a valid phone number' : '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        return '';
    
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data) {
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/signup');
        }, 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Registration failed. Please try again.';
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  const getFieldIcon = (fieldName) => {
    const icons = {
      fullName: User,
      email: Mail,
      phone: Phone,
      password: Lock,
      confirmPassword: Lock,
     
    };
    const Icon = icons[fieldName];
    return <Icon className="w-5 h-5 text-gray-400" />;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">Your account has been created successfully. You can now start exploring our platform.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(formData).map(([key, value], index) => (
            <div key={key} className={`transform transition-all duration-300 delay-${index * 100}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key === 'confirmPassword' ? 'Confirm Password' : key.replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getFieldIcon(key)}
                </div>
                <input
                  type={
                    key === 'email' ? 'email' : 
                    key === 'phone' ? 'tel' :
                    (key === 'password' || key === 'confirmPassword') ? 
                      (key === 'password' ? (showPassword ? 'text' : 'password') : 
                       (showConfirmPassword ? 'text' : 'password')) : 'text'
                  }
                  name={key}
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-${(key === 'password' || key === 'confirmPassword') ? '12' : '4'} py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors[key] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder={`Enter your ${key === 'confirmPassword' ? 'password again' : key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                />
                {(key === 'password' || key === 'confirmPassword') && (
                  <button
                    type="button"
                    onClick={() => key === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {(key === 'password' ? showPassword : showConfirmPassword) ? 
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" /> : 
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    }
                  </button>
                )}
              </div>
              {errors[key] && (
                <div className="flex items-center mt-2 text-red-500 text-sm animate-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[key]}
                </div>
              )}
            </div>
          ))}

          {/* Error Message for Submit */}
          {errors.submit && (
            <div className="flex items-center justify-center text-red-500 text-sm animate-in slide-in-from-top-1 mb-4">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/signup" 
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}