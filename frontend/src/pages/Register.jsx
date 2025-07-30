// ✅ Updated RegistrationPage with blue-900 theme and image-based right side
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../components/context/AuthContext';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName': {
        if (!value.trim()) return 'Full name is required';
        if (value.length < 2) return 'Full name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name can only contain letters and spaces';
        return '';
      }
      case 'email': {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      }
      case 'phone': {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[+]?\d{10,15}$/;
        return !phoneRegex.test(value.replace(/\s/g, '')) ? 'Please enter a valid phone number' : '';
      }
      case 'password': {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain a lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain an uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain a number';
        return '';
      }
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setIsSubmitting(true);
    try {
      const result = await register(formData);
      if (result.success) {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => navigate('/signin'), 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    }
  };

  const getFieldIcon = (fieldName) => {
    const icons = { fullName: User, email: Mail, phone: Phone, password: Lock, confirmPassword: Lock };
    const Icon = icons[fieldName];
    return <Icon className="w-5 h-5 text-blue-900" />;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-blue-900 mb-2">Registration Complete</h2>
          <p className="text-blue-800 mb-6">Your account was successfully created.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">Create your account</h2>
          <p className="text-blue-800">Start managing assets smarter today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                {key === 'confirmPassword' ? 'Confirm Password' : key.replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  {getFieldIcon(key)}
                </div>
                <input
                  type={(key.includes('password') ? (key === 'confirmPassword' ? showConfirmPassword : showPassword) ? 'text' : 'password' : key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text')}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 pr-10 py-3 w-full rounded-md border ${
                    errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-900 outline-none`}
                  placeholder={`Enter your ${key}`}
                />
                {(key.includes('password')) && (
                  <button
                    type="button"
                    onClick={() => key === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {(key === 'password' ? showPassword : showConfirmPassword) ? <EyeOff className="w-5 h-5 text-blue-900" /> : <Eye className="w-5 h-5 text-blue-900" />}
                  </button>
                )}
              </div>
              {errors[key] && <p className="text-sm text-red-600 mt-1">{errors[key]}</p>}
            </div>
          ))}

          {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-all duration-200 ${
              isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 hover:shadow-lg'
            }`}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-sm text-center text-blue-800">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-blue-900 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
