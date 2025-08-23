'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    BarChart3, 
    Settings, 
    LogOut, 
    User,
    Bell,
    Search,
    Eye,
    EyeOff,
    Menu,
    X
} from 'lucide-react'

export default function Dashboard() {
    const [user, setUser] = useState<{ fullName: string } | null>(null)
    const [showBalance, setShowBalance] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'trading' | 'portfolio'>('overview')
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user')
        if (!userData) {
            router.push('/Login')
            return
        }
        setUser(JSON.parse(userData))
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/Login')
    }

    const handleTabChange = (tab: 'overview' | 'trading' | 'portfolio') => {
        setActiveTab(tab)
        setShowMobileMenu(false)
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[#0a0a0a] opacity-100">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-[#0f141b] border-b border-[#2a2a2a] px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <h1 className="text-white text-xl lg:text-2xl font-bold">ProfitTrade</h1>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-[#1a1a1a] rounded-lg px-3 py-2 flex-1 max-w-md mx-6">
                            <Search className="text-gray-400 w-4 h-4 mr-2" />
                            <input
                                type="text"
                                placeholder="Search markets..."
                                className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 text-sm"
                            />
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-white">
                                <Bell className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <User className="text-white w-4 h-4" />
                                </div>
                                <span className="text-white text-sm hidden sm:block">{user.fullName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden text-gray-400 hover:text-white"
                            >
                                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile Navigation Menu */}
                {showMobileMenu && (
                    <div className="lg:hidden bg-[#0f141b] border-b border-[#2a2a2a] px-4 py-4">
                        <nav className="flex gap-2">
                            <button
                                onClick={() => handleTabChange('overview')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'overview'
                                        ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Overview
                            </button>
                            <button
                                onClick={() => handleTabChange('trading')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'trading'
                                        ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <TrendingUp className="w-4 h-4" />
                                Trading
                            </button>
                            <button
                                onClick={() => handleTabChange('portfolio')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'portfolio'
                                        ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <DollarSign className="w-4 h-4" />
                                Portfolio
                            </button>
                        </nav>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex">
                    {/* Sidebar - Desktop Only */}
                    <aside className="w-64 bg-[#0f141b] border-r border-[#2a2a2a] min-h-screen p-4 hidden lg:block">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'overview'
                                        ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('trading')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'trading'
                                        ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <TrendingUp className="w-4 h-4" />
                                Trading
                            </button>
                            <button
                                onClick={() => setActiveTab('portfolio')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'portfolio'
                                        ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <DollarSign className="w-4 h-4" />
                                Portfolio
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 p-4 lg:p-6">
                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-[#0f141b] to-[#1a1a1a] rounded-2xl p-4 lg:p-6 border border-[#2a2a2a] mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-white text-lg font-semibold">Account Balance</h2>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-white text-2xl lg:text-4xl font-bold">
                                    {showBalance ? '$10,250.00' : '****'}
                                </span>
                                <span className="text-green-400 text-sm">+$250.00 (2.5%)</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-[#0f141b] rounded-xl p-4 border border-[#2a2a2a]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="text-green-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Profit</p>
                                        <p className="text-white text-lg font-semibold">$2,450</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0f141b] rounded-xl p-4 border border-[#2a2a2a]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="text-blue-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Win Rate</p>
                                        <p className="text-white text-lg font-semibold">68%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0f141b] rounded-xl p-4 border border-[#2a2a2a]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <DollarSign className="text-purple-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Trades</p>
                                        <p className="text-white text-lg font-semibold">156</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0f141b] rounded-xl p-4 border border-[#2a2a2a]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                        <TrendingDown className="text-red-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Loss</p>
                                        <p className="text-white text-lg font-semibold">$890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content based on active tab */}
                        {activeTab === 'overview' && (
                            <div className="bg-[#0f141b] rounded-2xl p-4 lg:p-6 border border-[#2a2a2a]">
                                <h3 className="text-white text-xl font-semibold mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {[
                                        { type: 'profit', amount: '+$150', asset: 'BTC/USDT', time: '2 min ago' },
                                        { type: 'loss', amount: '-$75', asset: 'ETH/USDT', time: '15 min ago' },
                                        { type: 'profit', amount: '+$200', asset: 'ADA/USDT', time: '1 hour ago' },
                                        { type: 'profit', amount: '+$120', asset: 'SOL/USDT', time: '2 hours ago' }
                                    ].map((trade, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    trade.type === 'profit' ? 'bg-green-400' : 'bg-red-400'
                                                }`}></div>
                                                <div>
                                                    <p className="text-white font-medium">{trade.asset}</p>
                                                    <p className="text-gray-400 text-sm">{trade.time}</p>
                                                </div>
                                            </div>
                                            <span className={`font-semibold ${
                                                trade.type === 'profit' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {trade.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'trading' && (
                            <div className="bg-[#0f141b] rounded-2xl p-4 lg:p-6 border border-[#2a2a2a]">
                                <h3 className="text-white text-xl font-semibold mb-4">Quick Trade</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Asset</label>
                                        <select className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white">
                                            <option>BTC/USDT</option>
                                            <option>ETH/USDT</option>
                                            <option>ADA/USDT</option>
                                            <option>SOL/USDT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Amount</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div className="lg:col-span-2 flex gap-3">
                                        <button className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 py-3 rounded-lg hover:bg-green-500/30 transition-all">
                                            Call (Up)
                                        </button>
                                        <button className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-lg hover:bg-red-500/30 transition-all">
                                            Put (Down)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'portfolio' && (
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
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
