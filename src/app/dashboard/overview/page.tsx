'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Eye, EyeOff } from 'lucide-react'

export default function OverviewPage() {
    const [showBalance, setShowBalance] = useState(false)

    return (
        <DashboardLayout>
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-[#0f141b] to-[#1a1a1a] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-[#2a2a2a] mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-white text-base sm:text-lg font-semibold">Account Balance</h2>
                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-gray-400 hover:text-white p-1"
                    >
                        {showBalance ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-white text-xl sm:text-2xl lg:text-4xl font-bold">
                        {showBalance ? '$10,250.00' : '****'}
                    </span>
                    <span className="text-green-400 text-xs sm:text-sm">+$250.00 (2.5%)</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-[#0f141b] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#2a2a2a]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center self-start sm:self-center">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-400 text-xs sm:text-sm">Total Profit</p>
                            <p className="text-white text-base sm:text-lg font-semibold">$2,450</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f141b] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#2a2a2a]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center self-start sm:self-center">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-400 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-400 text-xs sm:text-sm">Win Rate</p>
                            <p className="text-white text-base sm:text-lg font-semibold">68%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f141b] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#2a2a2a]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center self-start sm:self-center">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-400 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-400 text-xs sm:text-sm">Total Trades</p>
                            <p className="text-white text-base sm:text-lg font-semibold">156</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f141b] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#2a2a2a]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg flex items-center justify-center self-start sm:self-center">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-400 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-400 text-xs sm:text-sm">Total Loss</p>
                            <p className="text-white text-base sm:text-lg font-semibold">$890</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#0f141b] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-[#2a2a2a]">
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Activity</h3>
                <div className="space-y-2 sm:space-y-3">
                    {[
                        { type: 'profit', amount: '+$150', asset: 'BTC/USDT', time: '2 min ago' },
                        { type: 'loss', amount: '-$75', asset: 'ETH/USDT', time: '15 min ago' },
                        { type: 'profit', amount: '+$200', asset: 'ADA/USDT', time: '1 hour ago' },
                        { type: 'profit', amount: '+$120', asset: 'SOL/USDT', time: '2 hours ago' }
                    ].map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-[#1a1a1a] rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                                    trade.type === 'profit' ? 'bg-green-400' : 'bg-red-400'
                                }`}></div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-white font-medium text-sm sm:text-base truncate">{trade.asset}</p>
                                    <p className="text-gray-400 text-xs sm:text-sm">{trade.time}</p>
                                </div>
                            </div>
                            <span className={`font-semibold text-sm sm:text-base flex-shrink-0 ml-2 ${
                                trade.type === 'profit' ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {trade.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
