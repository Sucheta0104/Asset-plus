import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, MapPin, Package, Tag, User, Building, Hash, Monitor, FileText, MapPin as Mappin } from 'lucide-react';
import axios from 'axios';

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
          className={`h-5 w-5 transition-colors duration-200 ${
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
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 ${
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
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 resize-none ${
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
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 ${
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');
    setMessageType('');

    try {
      const apiData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        purchaseDate: formData.purchaseDate || null,
        warrantyExpiry: formData.warrantyExpiry || null
      };

      const response = await axios.post('http://localhost:5000/api/asset/', apiData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      setSubmitMessage('Asset created successfully!');
      setMessageType('success');
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
      let errorMessage = 'Failed to create asset. Please try again.';

      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message || 'Unexpected error occurred.';
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
      <div className="w-full h-full p-6">
        {/* Header */}
        <div className="mb-6">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Asset</h1>
            <p className="text-gray-600">Create a new asset record</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <div className="space-y-8">
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Asset Information</h2>
              <p className="text-sm text-gray-600">Basic details about your asset</p>
            </div>

            {submitMessage && (
              <div className={`p-4 rounded-lg border animate-fade-in ${
                messageType === 'error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full mr-3 ${
                    messageType === 'error' ? 'bg-red-400' : 'bg-green-400'
                  }`}></div>
                  {submitMessage}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {/* Department Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
                  Department
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Building className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'department' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('department')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 ${
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
                { label: 'Location', name: 'location', icon: Mappin },
                { label: 'Warranty Expiry', name: 'warrantyExpiry', icon: Calendar, type: 'date' }
              ].map((field) => (
                <InputField
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField('')}
                  focusedField={focusedField}
                />
              ))}

              <div className="lg:col-span-3 xl:col-span-4">
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

            <div className="pt-6 border-t border-gray-200 w-full">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                  isFormValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.01] shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                } ${isSubmitting ? 'animate-pulse' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
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
      `}</style>
    </div>
  );
}
