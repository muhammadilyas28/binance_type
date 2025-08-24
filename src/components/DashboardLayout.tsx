'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [user, setUser] = useState<{ fullName: string } | null>(null)
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
                <Header
                    user={user}
                    showMobileMenu={showMobileMenu}
                    setShowMobileMenu={setShowMobileMenu}
                />

                {/* Main Content */}
                <div className="flex">
                    {/* Sidebar - Desktop Only */}
                    <Sidebar className="hidden lg:block" />

                    {/* Main Content Area */}
                    <main className="flex-1 p-4 lg:p-6">
                        {/* Page Content */}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
