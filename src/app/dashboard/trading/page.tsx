'use client'

import React from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import CandlestickChart from '@/components/CandlestickChart'

export default function TradingPage() {
    return (
        <DashboardLayout>
            <div className="w-full">
                <CandlestickChart />
            </div>
        </DashboardLayout>
    )
}
