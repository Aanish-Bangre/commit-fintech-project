import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen  text-white pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to{' '}
            <span className="text-blue-400">
              QuantEase
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your gateway to advanced quantitative finance tools and insights. 
            Harness the power of data-driven decision making with our comprehensive analytics platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
              Get Started
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-full transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              📊
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
            <p className="text-gray-300">
              Powerful tools for quantitative analysis, risk assessment, and portfolio optimization.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              📈
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Data</h3>
            <p className="text-gray-300">
              Access live market data, financial indicators, and economic metrics in real-time.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              🔒
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Platform</h3>
            <p className="text-gray-300">
              Enterprise-grade security with end-to-end encryption and secure authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
