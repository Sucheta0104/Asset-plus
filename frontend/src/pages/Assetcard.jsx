import React from 'react';

const AssetCard = ({ icon, title, description, features }) => {
  return (
    <div className="group perspective-1000 h-80 w-full">
      <div className="relative preserve-3d w-full h-full duration-700 group-hover:rotate-y-180">
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-slate-800/90 border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center p-8 hover:border-blue-500/50 transition-all duration-300">
          <div className="mb-7">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-4">{title}</h3>
          <p className="text-slate-300 text-center leading-relaxed text-sm">{description}</p>
        </div>
        
        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl bg-gradient-to-br from-blue-600/90 to-purple-700/90 border border-blue-500/30 shadow-2xl p-8 flex flex-col justify-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-white/90 text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const AssetPlusHero = () => {
  const cards = [
    {
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" className="text-emerald-400">
          <defs>
            <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50" fill="none" stroke="url(#portfolioGradient)" strokeWidth="3" opacity="0.3"/>
          <circle cx="60" cy="60" r="35" fill="none" stroke="url(#portfolioGradient)" strokeWidth="2"/>
          <path d="M40 60 L50 50 L70 70 L80 40" stroke="url(#portfolioGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="40" cy="60" r="3" fill="#10B981"/>
          <circle cx="50" cy="50" r="3" fill="#10B981"/>
          <circle cx="70" cy="70" r="3" fill="#10B981"/>
          <circle cx="80" cy="40" r="3" fill="#10B981"/>
          <text x="60" y="95" textAnchor="middle" className="fill-emerald-400 text-xs font-semibold">PORTFOLIO</text>
        </svg>
      ),
      title: "Portfolio Management",
      description: "Advanced portfolio tracking with real-time analytics and performance optimization",
      features: [
        "Real-time portfolio monitoring",
        "Advanced risk assessment tools",
        "Diversification optimization",
        "Performance benchmarking",
        "Custom allocation strategies"
      ]
    },
    {
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" className="text-purple-400">
          <defs>
            <linearGradient id="cryptoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <polygon points="60,20 80,35 80,55 60,70 40,55 40,35" fill="none" stroke="url(#cryptoGradient)" strokeWidth="2"/>
          <polygon points="30,40 45,30 45,50 30,60 15,50 15,30" fill="none" stroke="url(#cryptoGradient)" strokeWidth="2" opacity="0.6"/>
          <polygon points="90,40 105,30 105,50 90,60 75,50 75,30" fill="none" stroke="url(#cryptoGradient)" strokeWidth="2" opacity="0.6"/>
          <polygon points="60,70 75,60 75,80 60,90 45,80 45,60" fill="none" stroke="url(#cryptoGradient)" strokeWidth="2" opacity="0.6"/>
          <circle cx="60" cy="45" r="8" fill="url(#cryptoGradient)"/>
          <text x="60" y="110" textAnchor="middle" className="fill-purple-400 text-xs font-semibold">BLOCKCHAIN</text>
        </svg>
      ),
      title: "Blockchain Assets",
      description: "Comprehensive cryptocurrency and digital asset management platform",
      features: [
        "Multi-blockchain support",
        "DeFi protocol integration",
        "Yield farming optimization",
        "NFT portfolio tracking",
        "Cross-chain analytics"
      ]
    },
    {
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" className="text-blue-400">
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="15" fill="none" stroke="url(#networkGradient)" strokeWidth="3"/>
          <circle cx="30" cy="30" r="8" fill="url(#networkGradient)"/>
          <circle cx="90" cy="30" r="8" fill="url(#networkGradient)"/>
          <circle cx="90" cy="90" r="8" fill="url(#networkGradient)"/>
          <circle cx="30" cy="90" r="8" fill="url(#networkGradient)"/>
          <line x1="38" y1="38" x2="52" y2="52" stroke="url(#networkGradient)" strokeWidth="2"/>
          <line x1="82" y1="38" x2="68" y2="52" stroke="url(#networkGradient)" strokeWidth="2"/>
          <line x1="82" y1="82" x2="68" y2="68" stroke="url(#networkGradient)" strokeWidth="2"/>
          <line x1="38" y1="82" x2="52" y2="68" stroke="url(#networkGradient)" strokeWidth="2"/>
          <text x="60" y="110" textAnchor="middle" className="fill-blue-400 text-xs font-semibold">NETWORK</text>
        </svg>
      ),
      title: "Smart Analytics",
      description: "AI-powered insights and predictive analytics for optimal investment decisions",
      features: [
        "Machine learning algorithms",
        "Market sentiment analysis",
        "Predictive modeling",
        "Risk correlation mapping",
        "Automated rebalancing"
      ]
    },
    {
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" className="text-cyan-400">
          <defs>
            <linearGradient id="innovationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="35" fill="none" stroke="url(#innovationGradient)" strokeWidth="2" strokeDasharray="5,5">
            <animateTransform attributeName="transform" type="rotate" values="0 60 60;360 60 60" dur="20s" repeatCount="indefinite"/>
          </circle>
          <circle cx="60" cy="60" r="12" fill="url(#innovationGradient)"/>
          <path d="M45 45 L60 60 L75 45" stroke="url(#innovationGradient)" strokeWidth="2" fill="none"/>
          <path d="M75 75 L60 60 L45 75" stroke="url(#innovationGradient)" strokeWidth="2" fill="none"/>
          <circle cx="60" cy="25" r="3" fill="#22D3EE"/>
          <circle cx="95" cy="60" r="3" fill="#22D3EE"/>
          <circle cx="60" cy="95" r="3" fill="#22D3EE"/>
          <circle cx="25" cy="60" r="3" fill="#22D3EE"/>
          <text x="60" y="110" textAnchor="middle" className="fill-cyan-400 text-xs font-semibold">INNOVATION</text>
        </svg>
      ),
      title: "Innovation Engine",
      description: "Cutting-edge financial technology and disruptive investment strategies",
      features: [
        "Emerging market analysis",
        "Alternative investments",
        "ESG scoring integration",
        "Quantum computing research",
        "Future trend prediction"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full translate-x-48 translate-y-48 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full -translate-x-32 -translate-y-32 animate-pulse"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold tracking-wide">
                ASSET PLUS
              </span>
            </div>
            <h1 className="text-xl sm:text-xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              Next-Gen
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Asset Management
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              "Streamlining IT Assets for Maximum Efficiency and Control in Modern Software Enterprises."
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              
              <button className="px-10 py-4 border-2 border-slate-600 text-slate-300 rounded-full font-semibold hover:border-blue-500 hover:text-white transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {cards.map((card, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                <AssetCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  features={card.features}
                />
              </div>
            ))}
          </div>

          {/* Bottom Status Bar */}
          <div className="mt-20 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 text-slate-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm">Live Market Data</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm">AI-Powered Analytics</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm">Blockchain Secured</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm">24/7 Monitoring</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default AssetPlusHero;