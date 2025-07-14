import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, MapPin, Package, Tag, User, Building, Hash, Monitor, Eye } from 'lucide-react';

export default function AddAssetForm() {
  const [formData, setFormData] = useState({
    assetTag: '',
    assetName: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    cost: '',
    vendor: '',
    location: '',
    warrantyExpiry: ''
  });

  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Asset created:', formData);
    alert('Asset created successfully!');
    setIsSubmitting(false);
  };

  const isFormValid = () => {
    return formData.assetTag && formData.assetName && formData.category;
  };

  const getFilledFields = () => {
    return Object.entries(formData).filter(([key, value]) => value.trim() !== '');
  };

  const getFieldLabel = (key) => {
    const labels = {
      assetTag: 'Asset Tag',
      assetName: 'Asset Name',
      category: 'Category',
      brand: 'Brand',
      model: 'Model',
      serialNumber: 'Serial Number',
      purchaseDate: 'Purchase Date',
      cost: 'Cost',
      vendor: 'Vendor',
      location: 'Location',
      warrantyExpiry: 'Warranty Expiry'
    };
    return labels[key] || key;
  };

  const getFieldIcon = (key) => {
    const icons = {
      assetTag: Tag,
      assetName: Package,
      category: Monitor,
      brand: Building,
      model: Package,
      serialNumber: Hash,
      purchaseDate: Calendar,
      cost: DollarSign,
      vendor: User,
      location: MapPin,
      warrantyExpiry: Calendar
    };
    return icons[key] || Package;
  };

  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    required = false 
  }) => (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-200 ${
            focusedField === name ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </div>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField('')}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 ${
            focusedField === name ? 'shadow-lg scale-[1.02] border-blue-500' : 'shadow-sm'
          }`}
          required={required}
        />
      </div>
    </div>
  );

  const filledFields = getFilledFields();

  return (
    <div className="container">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Asset</h1>
              <p className="text-gray-600">Create a new asset record</p>
            </div>
            {filledFields.length > 0 && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
            <div className="space-y-8">
              {/* Asset Information Header */}
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Asset Information</h2>
                <p className="text-sm text-gray-600">Basic details about your asset</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Asset Tag"
                  name="assetTag"
                  placeholder="Enter asset tag"
                  icon={Tag}
                  required
                />
                
                <InputField
                  label="Asset Name"
                  name="assetName"
                  placeholder="Enter asset name"
                  icon={Package}
                  required
                />
                
                <InputField
                  label="Category"
                  name="category"
                  placeholder="Enter category"
                  icon={Monitor}
                  required
                />
                
                <InputField
                  label="Brand"
                  name="brand"
                  placeholder="Enter brand"
                  icon={Building}
                />
                
                <InputField
                  label="Model"
                  name="model"
                  placeholder="Enter model"
                  icon={Package}
                />
                
                <InputField
                  label="Serial Number"
                  name="serialNumber"
                  placeholder="Enter serial number"
                  icon={Hash}
                />
                
                <InputField
                  label="Purchase Date"
                  name="purchaseDate"
                  type="date"
                  placeholder=""
                  icon={Calendar}
                />
                
                <InputField
                  label="Cost"
                  name="cost"
                  type="number"
                  placeholder="Enter cost"
                  icon={DollarSign}
                />
                
                <InputField
                  label="Vendor"
                  name="vendor"
                  placeholder="Enter vendor"
                  icon={User}
                />
                
                <InputField
                  label="Location"
                  name="location"
                  placeholder="Enter location"
                  icon={MapPin}
                />
                
                <div className="md:col-span-2">
                  <InputField
                    label="Warranty Expiry"
                    name="warrantyExpiry"
                    type="date"
                    placeholder=""
                    icon={Calendar}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                    isFormValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-lg hover:shadow-xl'
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

          {/* Preview Panel */}
          {filledFields.length > 0 && (
            <div className={`bg-white rounded-2xl shadow-xl p-8 animate-slide-up transition-all duration-500 ${
              showPreview ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none lg:opacity-100 lg:scale-100 lg:pointer-events-auto'
            }`}>
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Asset Preview</h2>
                <p className="text-sm text-gray-600">
                  {filledFields.length} of 11 fields completed
                </p>
              </div>
              
              <div className="mt-6 space-y-4">
                {filledFields.map(([key, value], index) => {
                  const Icon = getFieldIcon(key);
                  return (
                    <div
                      key={key}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {getFieldLabel(key)}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {key === 'cost' && value ? `$${value}` : value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filledFields.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(filledFields.length / 11) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      {Math.round((filledFields.length / 11) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
    </div>
  );
}