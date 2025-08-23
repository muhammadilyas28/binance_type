import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[#0a0a0a] opacity-100">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 text-center w-full px-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 lg:p-12 border border-[#2a2a2a] max-w-sm sm:max-w-md mx-auto">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">ProfitTrade</h1>
          <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8">
            Welcome to the future of binary trading
          </p>
          <Link 
            href="/Login"
            className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 text-sm sm:text-base"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}