import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Mail, 
  User, 
  Edit3, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

// Mock ButtonCrossArrow component since it's not available
const ButtonCrossArrow = ({ onClick, children, className = "", disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    <span className="mr-2">{children || "Send Message"}</span>
    <Send className="w-4 h-4" />
  </button>
);

// Success Message Component
const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-green-800 font-medium">{message}</p>
    </div>
    <button 
      onClick={onClose}
      className="text-green-500 hover:text-green-700 transition-colors"
    >
      ×
    </button>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-red-800 font-medium">{message}</p>
    </div>
    <button 
      onClick={onClose}
      className="text-red-500 hover:text-red-700 transition-colors"
    >
      ×
    </button>
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        setSubmitStatus('success');
        setStatusMessage(data.message || 'Message sent successfully!');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        // Error from server
        setSubmitStatus('error');
        setStatusMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      // Network or other error
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setStatusMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeStatusMessage = () => {
    setSubmitStatus(null);
    setStatusMessage('');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "info@itpluspoint.com",
      subContent: "support@company.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "HR : +91 9658 745 188",
      subContent: "+1 (555) 987-6543",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "ITPlusPoint Solutions Pvt. Ltd. ISO 9001:2015",
      subContent: "MIG –II, 14/5, Housing Board Colony, Chandrasekharpur, Bhubaneswar, Odisha – 751016, India",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon - Fri: 9:00 AM - 6:00 PM",
      subContent: "Sat: 10:00 AM - 4:00 PM",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <>
      <Layout>
      <div className="mt-16 min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16 md:py-20">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 md:mb-6">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-black max-w-2xl mx-auto px-4">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Main Content - Updated padding and margins */}
        <div className="flex items-center justify-center py-12 md:py-16 px-4 mb-16">
          {/* Container with adjusted max-width and spacing */}
          <div className="w-full max-w-4xl mx-auto space-y-12 md:space-y-16">
            {/* Contact Form */}
            <div className="bg-white shadow-2xl rounded-3xl p-6 md:p-8 lg:p-12">
                
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">
                  Send us a Message
                </h2>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <SuccessMessage 
                    message={statusMessage} 
                    onClose={closeStatusMessage}
                  />
                )}
                
                {submitStatus === 'error' && (
                  <ErrorMessage 
                    message={statusMessage} 
                    onClose={closeStatusMessage}
                  />
                )}

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="relative">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400 absolute top-3 md:top-4 left-3 md:left-4" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                        disabled={isSubmitting}
                        className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 bg-gray-50 focus:bg-white transition-all duration-200 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 absolute top-3 md:top-4 left-3 md:left-4" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email"
                        required
                        disabled={isSubmitting}
                        className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 bg-gray-50 focus:bg-white transition-all duration-200 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <Edit3 className="w-4 h-4 md:w-5 md:h-5 text-gray-400 absolute top-3 md:top-4 left-3 md:left-4" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject"
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 bg-gray-50 focus:bg-white transition-all duration-200 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message..."
                      rows="5"
                      required
                      disabled={isSubmitting}
                      className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 resize-none bg-gray-50 focus:bg-white transition-all duration-200 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-2 md:pt-4">
                    <ButtonCrossArrow 
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2 text-sm`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </ButtonCrossArrow>
                  </div>
                </form>
            </div>

            {/* Get in Touch Section */}
            <div className="space-y-6 md:space-y-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">Get in Touch</h2>
                <p className="text-gray-600 text-base md:text-lg px-4">
                  Ready to start your project? Contact us through any of these channels.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="grid gap-4 md:gap-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className={`p-2 md:p-3 rounded-xl bg-blue-950 ${item.color} flex-shrink-0`}>
                        <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 font-medium mb-1 break-words">
                          {item.content}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 break-words">
                          {item.subContent}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media Section */}
              <div className="bg-blue-950 p-6 md:p-8 rounded-2xl text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">Follow Us</h3>
                <p className="text-center text-blue-100 mb-4 md:mb-6 text-sm md:text-base">
                  Stay connected with us on social media
                </p>
                <div className="flex justify-center space-x-3 md:space-x-4">
                  <a 
                    href="https://twitter.com/company" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full hover:bg-opacity-30 transition-all duration-200 hover:scale-110"
                  >
                    <FaTwitter className=" text-black w-5 h-5 md:w-6 md:h-6" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/yourcompany" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full hover:bg-opacity-30 transition-all duration-200 hover:scale-110"
                  >
                    <FaLinkedin className=" text-black w-5 h-5 md:w-6 md:h-6" />
                  </a>
                  <a 
                    href="https://facebook.com/yourcompany" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full hover:bg-opacity-30 transition-all duration-200 hover:scale-110"
                  >
                    <FaFacebook className=" text-black w-5 h-5 md:w-6 md:h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       </Layout>
      </>
  );
}