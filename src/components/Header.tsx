'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
    LogOut, 
    User,
    Bell,
    Search,
    Menu,
    X
} from 'lucide-react'

interface HeaderProps {
    user: { fullName: string } | null
    showMobileMenu: boolean
    setShowMobileMenu: (show: boolean) => void
}

export default function Header({ 
    user, 
    showMobileMenu, 
    setShowMobileMenu
}: HeaderProps) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/Login')
    }

    if (!user) return null

    return (
        <>
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
                        <a
                            href="/dashboard/overview"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                        >
                            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                            Overview
                        </a>
                        <a
                            href="/dashboard/trading"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                        >
                            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                            Trading
                        </a>
                        <a
                            href="/dashboard/portfolio"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                        >
                            <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                            Portfolio
                        </a>
                    </nav>
                </div>
            )}
        </>
    )
}
