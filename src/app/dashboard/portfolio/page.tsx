'use client'

import React from 'react'
import DashboardLayout from '@/components/DashboardLayout'

export default function PortfolioPage() {
    return (
        <DashboardLayout>
            <div className="bg-[#0f141b] rounded-2xl p-4 lg:p-6 border border-[#2a2a2a]">
                <h3 className="text-white text-xl font-semibold mb-4">Portfolio Performance</h3>
                <div className="space-y-4">
                    {[
                        { asset: 'BTC', amount: '0.25', value: '$8,750', change: '+12.5%' },
                        { asset: 'ETH', amount: '2.5', value: '$4,500', change: '+8.2%' },
                        { asset: 'ADA', amount: '5000', value: '$2,250', change: '-3.1%' },
                        { asset: 'SOL', amount: '25', value: '$1,800', change: '+15.7%' }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                            <div>
                                <p className="text-white font-medium">{item.asset}</p>
                                <p className="text-gray-400 text-sm">{item.amount} {item.asset}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-medium">{item.value}</p>
                                <p className={`text-sm ${
                                    item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {item.change}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
