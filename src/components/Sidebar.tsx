'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
    TrendingUp, 
    DollarSign, 
    BarChart3
} from 'lucide-react'

interface SidebarProps {
    className?: string
}

export default function Sidebar({ className = '' }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const navigationItems = [
        {
            name: 'Overview',
            path: '/dashboard/overview',
            icon: BarChart3,
            active: pathname === '/dashboard/overview'
        },
        {
            name: 'Trading',
            path: '/dashboard/trading',
            icon: TrendingUp,
            active: pathname === '/dashboard/trading'
        },
        {
            name: 'Portfolio',
            path: '/dashboard/portfolio',
            icon: DollarSign,
            active: pathname === '/dashboard/portfolio'
        }
    ]

    const handleNavigation = (path: string) => {
        router.push(path)
    }

    return (
        <aside className={`w-64 bg-[#0f141b] border-r border-[#2a2a2a] min-h-screen p-4 ${className}`}>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                </div>
                <h1 className="text-white text-xl lg:text-2xl font-bold">ProfitTrade</h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                item.active
                                    ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {item.name}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}
