import React from 'react';
import Layout from '../components/Layout';
import { TrendingUp, Shield, Users, Award, Target, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  About 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {' '}AssetPlus
                  </span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Empowering organizations with intelligent asset management solutions that drive efficiency, reduce costs, and maximize value across your entire portfolio.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">98% Client Satisfaction</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">Enterprise Security</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-30"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Professional team analyzing financial data and asset performance on multiple screens"
                  className="relative rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              To revolutionize how organizations manage their assets by providing cutting-edge technology solutions that transform complex data into actionable insights, enabling smarter decisions and sustainable growth.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { number: '500+', label: 'Clients Served', icon: Users },
              { number: '$2.5B+', label: 'Assets Managed', icon: TrendingUp },
              { number: '15+', label: 'Years Experience', icon: Award },
              { number: '99.9%', label: 'System Uptime', icon: Shield }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mb-4 mx-auto">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 text-center">{stat.number}</div>
                <div className="text-gray-600 text-center font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Core Values */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Target,
                title: 'Precision',
                description: 'We deliver accurate, data-driven insights that help you make informed decisions about your asset portfolio with confidence.'
              },
              {
                icon: Zap,
                title: 'Innovation',
                description: 'Leveraging cutting-edge technology and AI-powered analytics to stay ahead of market trends and optimize performance.'
              },
              {
                icon: Shield,
                title: 'Trust',
                description: 'Your assets and data are protected with enterprise-grade security and compliance standards you can rely on.'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Story Section */}
          {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Founded in 2008 by a team of financial experts and technology innovators, AssetFlow emerged from a simple observation: organizations were struggling to effectively manage and optimize their growing asset portfolios in an increasingly complex market environment.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  What started as a small consulting firm has evolved into a comprehensive asset management platform trusted by Fortune 500 companies worldwide. Our journey has been driven by continuous innovation and an unwavering commitment to client success.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, we're proud to be at the forefront of the digital transformation in asset management, helping organizations unlock the full potential of their investments through intelligent automation and predictive analytics.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur-xl opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80" 
                  alt="Modern office building representing growth and success in asset management"
                  className="relative rounded-xl shadow-xl w-full h-80 object-cover"
                />
              </div>
            </div>
          </div> */}

          {/* Team Section */}
          {/* <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our experienced leadership team brings together decades of expertise in finance, technology, and strategic management.
            </p>
          </div> */}

          {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Founder', experience: '20+ years in Asset Management' },
              { name: 'Michael Chen', role: 'CTO', experience: '15+ years in FinTech' },
              { name: 'Emily Rodriguez', role: 'Head of Strategy', experience: '12+ years in Financial Services' },
              { name: 'David Kim', role: 'VP of Engineering', experience: '18+ years in Software Development' },
              { name: 'Lisa Thompson', role: 'Head of Client Success', experience: '14+ years in Customer Relations' },
              { name: 'James Wilson', role: 'Chief Risk Officer', experience: '16+ years in Risk Management' }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.experience}</p>
              </div>
            ))}
          </div> */}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 lg:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Asset Management?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations who trust AssetFlow to optimize their portfolios and drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}