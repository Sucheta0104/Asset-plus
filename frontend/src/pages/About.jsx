import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Shield, TrendingUp, Users, Zap, Award, Target, BarChart3, Lock} from 'lucide-react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Asset Tracking",
      description: "Enterprise-grade security with real-time monitoring and audit trails"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Advanced analytics to optimize asset utilization and ROI"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Seamless workflow management for distributed teams"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automated Workflows",
      description: "Smart automation to reduce manual processes by 80%"
    }
  ];

  const stats = [
    { number: "10K+", label: "Assets Managed", icon: <BarChart3 className="w-5 h-5" /> },
    { number: "500+", label: "Companies Trust Us", icon: <Award className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <Lock className="w-5 h-5" /> },
    { number: "24/7", label: "Support Available", icon: <Target className="w-5 h-5" /> }
  ];

  return (
    <Layout>
    <div className="min-h-screen bg-#f2f3f6 text-black overflow-hidden mt-15">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full opacity-10 animate-ping animation-delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-bounce">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-blue-950 bg-clip-text text-transparent">
            Asset Plus
          </h1>
          <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto leading-relaxed">
            Revolutionizing asset management with cutting-edge technology and intuitive design
          </p>
        </div>

        {/* Mission Statement */}
        <div className={`text-center mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">Our Mission</h2>
            <p className="text-lg md:text-xl text-black leading-relaxed">
              At Asset Plus, we believe that effective asset management shouldn't be complicated. 
              Our platform combines powerful analytics, seamless integration, and user-friendly design 
              to help organizations maximize their asset potential while minimizing operational complexity.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 ${
                activeFeature === index ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : 'bg-white/5'
              }`}
            >
              <div className={`text-blue-400 mb-4 transition-all duration-300 ${activeFeature === index ? 'scale-110' : ''}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">{feature.title}</h3>
              <p className="text-black text-sm leading-relaxed">{feature.description}</p>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex items-center justify-center mb-3 text-blue-400 group-hover:text-purple-400 transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-boldtext-black mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-black">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Company Values */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">Why Choose Asset Plus?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">Innovation First</h3>
              <p className="text-black">We leverage cutting-edge technology to deliver solutions that stay ahead of industry trends.</p>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-300">Customer-Centric</h3>
              <p className="text-black">Every feature is designed with your success in mind, backed by dedicated support.</p>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">Scalable Solutions</h3>
              <p className="text-black">From startups to enterprises, our platform grows with your business needs.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center space-x-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started Today
            </button>
           </div>
        </div>
      </div>
      

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes ping {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
    </Layout>
    
  );
};

export default AboutSection;