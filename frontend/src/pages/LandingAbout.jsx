import React from 'react'

const LandingAbout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 mt-6">
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
      </div>
  )
}

export default LandingAbout