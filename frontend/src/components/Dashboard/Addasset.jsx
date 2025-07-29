import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, MapPin, Package, Tag, User, Building, Hash, Monitor, FileText } from 'lucide-react';
import axios from 'axios';

// Add axios interceptor setup
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// ✅ Move this OUTSIDE of AddAssetForm
const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  required = false,
  value,
  options,
  onChange,
  onFocus,
  onBlur,
  focusedField,
}) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Icon
          className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
            focusedField === name ? 'text-blue-500' : 'text-gray-400'
          }`}
        />
      </div>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 text-sm sm:text-base ${
            focusedField === name ? 'shadow-lg border-blue-500' : 'shadow-sm'
          }`}
          required={required}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={4}
          className={`w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 resize-none text-sm sm:text-base ${
            focusedField === name ? 'shadow-lg border-blue-500' : 'shadow-sm'
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          step={type === 'number' ? '0.01' : undefined}
          min={type === 'number' ? '0' : undefined}
          className={`w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 text-sm sm:text-base ${
            focusedField === name ? 'shadow-lg border-blue-500' : 'shadow-sm'
          }`}
        />
      )}
    </div>
  </div>
);

export default function AddAssetForm() {
  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    cost: '',
    vendor: '',
    location: '',
    warrantyExpiry: '',
    description: '',
    department: ''
  });

  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackClick = () => {
    // Try different navigation methods based on available APIs
    if (window.history.length > 1) {
      window.history.back();
    } else if (window.parent && window.parent !== window) {
      // If in iframe, try to communicate with parent
      window.parent.postMessage({ action: 'navigate_back' }, '*');
    } else {
      // Fallback: reload or redirect to a dashboard/home page
      // You can customize this URL based on your application structure
      window.location.href = '/dashboard' || '/';
    }
  };

  const handleSubmit = async () => {
   
    setIsSubmitting(true);
    setSubmitMessage('');
    setMessageType('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Prepare data for API
      const assetData = {
        assetTag: formData.assetTag,
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate,
        cost: parseFloat(formData.cost) || 0,
        vendor: formData.vendor,
        location: formData.location,
        warrantyExpiry: formData.warrantyExpiry,
        description: formData.description,
        department: formData.department,
        status: 'Available' // Default status
      };

      console.log('Creating asset with data:', assetData);

      // Make API call to create asset
      const response = await axios.post('http://localhost:5000/api/asset', assetData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Asset created successfully:', response.data);
      
      // Trigger data refresh in other components
      window.dispatchEvent(new CustomEvent('assetDataChanged', {
        detail: { type: 'asset_created', data: response.data }
      }));
      
      // If vendor was specified, also trigger vendor data change
      if (formData.vendor && formData.vendor.trim()) {
        window.dispatchEvent(new CustomEvent('vendorDataChanged', {
          detail: { type: 'vendor_referenced', vendor: formData.vendor, asset: response.data }
        }));
      }
      
      setSubmitMessage('Asset created successfully!');
      setMessageType('success');
      
      // Reset form
      setFormData({
        assetTag: '',
        name: '',
        category: '',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        cost: '',
        vendor: '',
        location: '',
        warrantyExpiry: '',
        description: '',
        department: ''
      });

      setTimeout(() => {
        setSubmitMessage('');
        setMessageType('');
      }, 5000);

    } catch (error) {
      console.error('Error creating asset:', error);
      
      let errorMessage = 'Failed to create asset. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        localStorage.removeItem('token');
        window.location.href = '/';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setSubmitMessage(errorMessage);
      setMessageType('error');

      setTimeout(() => {
        setSubmitMessage('');
        setMessageType('');
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.assetTag.trim() && formData.name.trim() && formData.category.trim();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full h-full p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-3 sm:mb-4 group touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Add New Asset</h1>
            <p className="text-sm sm:text-base text-gray-600">Create a new asset record</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 w-full">
          <div className="space-y-6 sm:space-y-8">
            <div className="pb-4 sm:pb-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Asset Information</h2>
              <p className="text-xs sm:text-sm text-gray-600">Basic details about your asset</p>
            </div>

            {submitMessage && (
              <div className={`p-3 sm:p-4 rounded-lg border animate-fade-in ${
                messageType === 'error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 ${
                    messageType === 'error' ? 'bg-red-400' : 'bg-green-400'
                  }`}></div>
                  <span className="text-xs sm:text-sm">{submitMessage}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
              {/* Department Field */}
              <div className="group sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
                  Department
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Building className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                      focusedField === 'department' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('department')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 text-sm sm:text-base ${
                      focusedField === 'department' ? 'shadow-lg border-blue-500' : 'shadow-sm'
                    }`}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>

              {[
                { label: 'Asset Tag', name: 'assetTag', icon: Tag, required: true },
                { label: 'Asset Name', name: 'name', icon: Package, required: true },
                {
                  label: 'Category',
                  name: 'category',
                  icon: Monitor,
                  required: true,
                  type: 'select',
                  options: [
                    { value: '', label: 'Select Category' },
                    { value: 'IT', label: 'IT' },
                    { value: 'Furniture', label: 'Furniture' },
                    { value: 'Vehicle', label: 'Vehicle' }
                  ]
                },
                { label: 'Brand', name: 'brand', icon: Building },
                { label: 'Model', name: 'model', icon: Package },
                { label: 'Serial Number', name: 'serialNumber', icon: Hash },
                { label: 'Purchase Date', name: 'purchaseDate', icon: Calendar, type: 'date' },
                { label: 'Cost', name: 'cost', icon: DollarSign, type: 'number' },
                { label: 'Vendor', name: 'vendor', icon: User },
                { label: 'Location', name: 'location', icon: MapPin },
                { label: 'Warranty Expiry', name: 'warrantyExpiry', icon: Calendar, type: 'date' }
              ].map((field) => (
                <div key={field.name} className={field.name === 'assetTag' || field.name === 'name' ? 'sm:col-span-2 lg:col-span-1' : ''}>
                  <InputField
                    {...field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField('')}
                    focusedField={focusedField}
                  />
                </div>
              ))}

              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <InputField
                  label="Description"
                  name="description"
                  type="textarea"
                  icon={FileText}
                  placeholder="Additional details about the asset"
                  value={formData.description}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField('')}
                  focusedField={focusedField}
                />
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-gray-200 w-full">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-white transition-all duration-300 transform text-sm sm:text-base touch-manipulation ${
                  isFormValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.01] shadow-lg hover:shadow-xl active:scale-[0.99]'
                    : 'bg-gray-400 cursor-not-allowed'
                } ${isSubmitting ? 'animate-pulse' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                    Creating Asset...
                  </div>
                ) : (
                  'Create Asset'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Ensure touch targets are large enough on mobile */
        @media (max-width: 640px) {
          .touch-manipulation {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </div>
  );
}