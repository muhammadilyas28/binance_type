'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, User, Mail, Check, Plus, Eye as EyeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<{[key: string]: string}>({})
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {}
        
        if (activeTab === 'register' && !formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }
        
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // For demo purposes, accept any valid email/password
            // In real app, you'd validate against your backend
            if (formData.email && formData.password.length >= 6) {
                // Store user data in localStorage or context
                localStorage.setItem('user', JSON.stringify({
                    email: formData.email,
                    fullName: formData.fullName || 'User'
                }))
                
                // Redirect to dashboard
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[#0a0a0a] opacity-100">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Left Panel - Marketing */}
                <div className="w-full lg:flex-1 bg-[#0f141b] rounded-2xl p-4 lg:p-6 border border-[#2a2a2a] relative overflow-hidden order-2 lg:order-1">
                    {/* Internal grid pattern */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}></div>

                    <div className="relative z-10">
                        {/* Top tag */}
                        <div className="inline-block bg-[#2a2a2a] text-gray-300 text-xs px-3 py-1 rounded-full mb-4 lg:mb-6">
                            BINANCE-STYLE • DARK UI
                        </div>

                        {/* Logo and branding */}
                        <div className="flex items-center gap-3 mb-4 lg:mb-6">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl lg:text-2xl">P</span>
                            </div>
                            <h1 className="text-white text-2xl lg:text-3xl font-bold">ProfitTrade</h1>
                        </div>

                        {/* Main headline */}
                        <h2 className="text-white text-2xl lg:text-4xl font-bold mb-3 lg:mb-4">
                            Binary Trading — Fast • Simple • Secure
                        </h2>

                        {/* Description */}
                        <p className="text-gray-400 text-base lg:text-lg mb-6 lg:mb-8">
                            Start trading with confidence — learn, trade, and grow your portfolio.
                        </p>

                        {/* Highlighted feature box */}
                        <div className="bg-gradient-to-r from-teal-700/50 to-green-700/80 rounded-xl px-3 lg:px-4 py-3 mb-6 lg:mb-8">
                            <p className="text-white text-left font-medium text-sm lg:text-base">
                                Real market from binance + trading view — enjoy your profit with real money.
                            </p>
                        </div>

                        {/* Feature list - styled as boxed overlays like the image */}
                        {(() => {
                            const features = [
                                {
                                    title: "Live Prices",
                                    sub: "(Free API)",
                                    icon: <Check className="text-green-400 w-4 h-4" />,
                                    extra: null,
                                },
                                {
                                    title: "Leverage",
                                    sub: "• SL • TP (Soon)",
                                    icon: <Plus className="text-blue-400 w-4 h-4" />,
                                    extra: (
                                        <div className="flex gap-2 mt-2 pl-6">
                                            <div className="w-3 h-6 bg-blue-400 rounded-md"></div>
                                            <div className="w-3 h-6 bg-green-400 rounded-md"></div>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Binary Mode",
                                    sub: null,
                                    icon: <EyeIcon className="text-purple-400 w-4 h-4" />,
                                    extra: (
                                        <div className="flex gap-2 mt-2 pl-6">
                                            <div className="w-3 h-6 bg-green-400 rounded-md"></div>
                                            <div className="w-3 h-6 bg-blue-400 rounded-md"></div>
                                        </div>
                                    ),
                                },
                            ];
                            return (
                                <div className="flex flex-col sm:flex-row gap-3 lg:gap-5">
                                    {features.map((feature, idx) => (
                                        <div
                                            key={feature.title}
                                            className="bg-[#181d23] w-full sm:w-1/3 border border-[#23272e] rounded-xl p-3 lg:p-4 flex flex-col items-start shadow-lg relative"
                                        >
                                            <div className="flex items-start gap-2 mb-0.5">
                                                {feature.icon}
                                                <div className="-mt-1">
                                                    <span className="text-white text-sm font-semibold">{feature.title}</span>
                                                    {feature.sub && idx === 1 && (
                                                        <span className="text-gray-400 text-xs font-medium ml-1">{feature.sub}</span>
                                                    )}
                                                </div>
                                            </div>
                                            {feature.sub && idx !== 1 && (
                                                <span className="text-gray-400 text-xs pl-6 mt-0.5">{feature.sub}</span>
                                            )}
                                            {feature.extra}
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}

                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div
                    className="w-full lg:flex-1 rounded-2xl p-4 lg:p-6 relative overflow-hidden order-1 lg:order-2"
                    style={{
                        background: "rgba(30, 30, 29, 0.63)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)",
                        WebkitBackdropFilter: "blur(5px)",
                        border: "1px solid rgba(30, 30, 29, 0.3)",
                    }}
                >
                    {/* Internal grid pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                        }}
                    ></div>
                    <div className="relative z-10">
                        {/* Tabs */}
                        <div className="flex bg-[#2a2a2a] rounded-full p-1 mb-6 lg:mb-8">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-2 px-3 lg:px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'login'
                                        ? 'bg-gradient-to-r from-blue-500/50 to-green-500/50 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`flex-1 py-2 lg:py-3 px-3 lg:px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'register'
                                        ? 'bg-gradient-to-r from-blue-500/50 to-green-500/50 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Register
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {activeTab === 'register' && (
                                <div>
                                    <label className="block text-gray-400 text-sm lg:text-xsm font-normal mb-2 lg:mb-3">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            className={`w-full bg-[#2a2a2a] border rounded-md px-3 lg:px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                                                errors.fullName ? 'border-red-500' : 'border-[#3a3a3a]'
                                            }`}
                                        />
                                        <User className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4 lg:w-5 lg:h-5" />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-400 text-sm lg:text-xsm font-normal mb-2 lg:mb-3">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full bg-[#2a2a2a] border rounded-md px-3 lg:px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
                                            errors.email ? 'border-red-500' : 'border-[#3a3a3a]'
                                        }`}
                                    />
                                    <Mail className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4 lg:w-5 lg:h-5" />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm lg:text-xsm font-normal mb-2 lg:mb-3">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={`w-full bg-[#2a2a2a] border rounded-md px-3 lg:px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 lg:pr-12 text-sm lg:text-base ${
                                            errors.password ? 'border-red-500' : 'border-[#3a3a3a]'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-3 bg-gradient-to-r from-blue-500/50 to-green-500/50 text-white font-bold py-2.5 lg:py-3 px-4 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        {/* Separator */}
                        <div className="relative my-4 lg:my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#3a3a3a]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#1f1f1f] text-gray-400">or</span>
                            </div>
                        </div>

                        {/* Google Sign Up */}
                        <button className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white py-2.5 lg:py-3 px-4 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 text-sm lg:text-base">
                            Sign up with Google
                        </button>

                        {/* Privacy text */}
                        <p className="text-gray-500 text-xs text-center mt-4 lg:mt-6 leading-relaxed">
                            We will never share your email. Creating an account enables access to the trading dashboard with live Binance market data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login