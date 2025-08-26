'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface PaymentRequest {
  id: string
  userId: string
  userName: string
  amount: number
  paymentDate: string
  status: 'pending' | 'approved' | 'rejected'
  isVerified: boolean
  description: string
}

interface BonusRecord {
  id: number
  userId: string
  userName: string
  type: string
  amount: number
  date: string
  status: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'trading' | 'users' | 'funds'>('dashboard')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeUsers] = useState([
    {
      id: 'U001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'online',
      lastSeen: '2 minutes ago',
      avatar: null,
      unreadMessages: 3
    },
    {
      id: 'U002', 
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'online',
      lastSeen: '5 minutes ago',
      avatar: null,
      unreadMessages: 0
    },
    {
      id: 'U003',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      status: 'offline',
      lastSeen: '1 hour ago',
      avatar: null,
      unreadMessages: 1
    },
    {
      id: 'U004',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      status: 'online',
      lastSeen: '10 minutes ago',
      avatar: null,
      unreadMessages: 0
    },
    {
      id: 'U005',
      name: 'David Brown',
      email: 'david.brown@example.com',
      status: 'away',
      lastSeen: '30 minutes ago',
      avatar: null,
      unreadMessages: 2
    }
  ])
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([
    {
      id: 'PR001',
      userId: 'U001',
      userName: 'John Doe',
      amount: 1500.00,
      paymentDate: '2024-01-15',
      status: 'pending',
      isVerified: true,
      description: 'Monthly subscription payment'
    },
    {
      id: 'PR002',
      userId: 'U002',
      userName: 'Jane Smith',
      amount: 2500.00,
      paymentDate: '2024-01-16',
      status: 'pending',
      isVerified: false,
      description: 'Premium service upgrade'
    },
    {
      id: 'PR003',
      userId: 'U003',
      userName: 'Mike Johnson',
      amount: 800.00,
      paymentDate: '2024-01-17',
      status: 'approved',
      isVerified: true,
      description: 'Basic service payment'
    },
    {
      id: 'PR004',
      userId: 'U004',
      userName: 'Sarah Wilson',
      amount: 3200.00,
      paymentDate: '2024-01-18',
      status: 'rejected',
      isVerified: false,
      description: 'Enterprise package payment'
    }
  ])

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterVerified, setFilterVerified] = useState<string>('all')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: 'Admin User',
    email: 'admin@company.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: null as File | null
  })
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      userId: 'U001',
      userName: 'John Doe',
      message: 'I need help with my trading account',
      timestamp: '2024-01-15T10:30:00',
      isAdmin: false
    },
    {
      id: 2,
      userId: 'admin',
      userName: 'Admin',
      message: 'Hello John, how can I assist you today?',
      timestamp: '2024-01-15T10:32:00',
      isAdmin: true
    },
    {
      id: 3,
      userId: 'U002',
      userName: 'Jane Smith',
      message: 'My withdrawal request is pending for 3 days',
      timestamp: '2024-01-15T11:15:00',
      isAdmin: false
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [tradingHistory, setTradingHistory] = useState([
    {
      id: 1,
      userId: 'U001',
      userName: 'John Doe',
      symbol: 'BTC/USDT',
      type: 'buy',
      amount: 0.5,
      price: 45000,
      total: 22500,
      timestamp: '2024-01-15T09:30:00',
      status: 'completed'
    },
    {
      id: 2,
      userId: 'U002',
      userName: 'Jane Smith',
      symbol: 'ETH/USDT',
      type: 'sell',
      amount: 2.0,
      price: 3200,
      total: 6400,
      timestamp: '2024-01-15T10:15:00',
      status: 'completed'
    },
    {
      id: 3,
      userId: 'U003',
      userName: 'Mike Johnson',
      symbol: 'ADA/USDT',
      type: 'buy',
      amount: 1000,
      price: 0.45,
      total: 450,
      timestamp: '2024-01-15T11:00:00',
      status: 'pending'
    }
  ])
  const [notifications] = useState([
    {
      id: 1,
      type: 'user_register',
      title: 'New User Registration',
      message: 'John Smith registered as a new user',
      time: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'trade',
      title: 'Large Trade Executed',
      message: 'User ID: U001 made a trade of $5,000 BTC',
      time: '5 minutes ago',
      isRead: false
    },
    {
      id: 3,
      type: 'profit',
      title: 'High Profit Alert',
      message: 'User ID: U003 achieved 25% profit on ETH trade',
      time: '10 minutes ago',
      isRead: true
    },
    {
      id: 4,
      type: 'loss',
      title: 'Loss Alert',
      message: 'User ID: U002 experienced 15% loss on ADA trade',
      time: '15 minutes ago',
      isRead: true
    },
    {
      id: 5,
      type: 'price_change',
      title: 'Bitcoin Price Change',
      message: 'BTC price increased by 8.5% in the last hour',
      time: '20 minutes ago',
      isRead: false
    },
    {
      id: 6,
      type: 'user_register',
      title: 'New User Registration',
      message: 'Sarah Johnson registered as a new user',
      time: '25 minutes ago',
      isRead: true
    },
    {
      id: 7,
      type: 'trade',
      title: 'Multiple Trades',
      message: 'User ID: U004 executed 3 trades totaling $12,000',
      time: '30 minutes ago',
      isRead: true
    },
    {
      id: 8,
      type: 'price_change',
      title: 'Ethereum Price Drop',
      message: 'ETH price decreased by 3.2% in the last 30 minutes',
      time: '45 minutes ago',
      isRead: false
    }
  ])
  const [fundsData, setFundsData] = useState({
    dailyBonus: 50,
    maxDailyBonus: 200,
    minDeposit: 10,
    maxDeposit: 10000,
    bonusPercentage: 5,
    maxBonusAmount: 500
  })
  const [bonusHistory, setBonusHistory] = useState<BonusRecord[]>([
    {
      id: 1,
      userId: 'U001',
      userName: 'John Doe',
      type: 'daily_bonus',
      amount: 50,
      date: '2024-01-15',
      status: 'credited'
    },
    {
      id: 2,
      userId: 'U002',
      userName: 'Jane Smith',
      type: 'deposit_bonus',
      amount: 25,
      date: '2024-01-15',
      status: 'credited'
    },
    {
      id: 3,
      userId: 'U003',
      userName: 'Mike Johnson',
      type: 'daily_bonus',
      amount: 50,
      date: '2024-01-14',
      status: 'pending'
    }
  ])
  const [showEditFundsModal, setShowEditFundsModal] = useState(false)
  const [showEditBonusModal, setShowEditBonusModal] = useState(false)
  const [editingBonus, setEditingBonus] = useState<BonusRecord | null>(null)
  const [fundsSubTab, setFundsSubTab] = useState<'funds' | 'bonuses'>('funds')
  const [editFundsData, setEditFundsData] = useState({
    dailyBonus: 50,
    maxDailyBonus: 200,
    minDeposit: 10,
    maxDeposit: 10000,
    bonusPercentage: 5,
    maxBonusAmount: 500
  })

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setPaymentRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status: newStatus }
          : request
      )
    )
  }

  const filteredRequests = paymentRequests.filter(request => {
    const statusMatch = filterStatus === 'all' || request.status === filterStatus
    const verifiedMatch = filterVerified === 'all' || 
      (filterVerified === 'verified' && request.isVerified) ||
      (filterVerified === 'unverified' && !request.isVerified)
    return statusMatch && verifiedMatch
  })

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`
      case 'approved':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`
      case 'rejected':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
    }
  }

  const getVerifiedBadge = (isVerified: boolean) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    return isVerified 
      ? `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`
      : `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user_register':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        )
      case 'trade':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case 'profit':
        return (
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'loss':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'price_change':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z" />
          </svg>
        )
    }
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to update the profile
    console.log('Profile updated:', profileData)
    
    // Update the profile data with the new values
    setProfileData(prev => ({
      ...prev,
      fullName: prev.fullName,
      email: prev.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
      // Keep the profile picture and preview
    }))
    
    setShowProfileModal(false)
    // Don't clear the preview - keep it for the header
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileData(prev => ({ ...prev, profilePicture: file }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearProfilePicture = () => {
    setProfileData(prev => ({ ...prev, profilePicture: null }))
    setProfilePreview(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        userId: 'admin',
        userName: 'Admin',
        message: newMessage,
        timestamp: new Date().toISOString(),
        isAdmin: true
      }
      setChatMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const handleEditFunds = () => {
    setEditFundsData(fundsData)
    setShowEditFundsModal(true)
  }

  const handleSaveFunds = () => {
    setFundsData(editFundsData)
    setShowEditFundsModal(false)
  }

  const handleEditBonus = (bonus: BonusRecord) => {
    setEditingBonus(bonus)
    setShowEditBonusModal(true)
  }

  const handleSaveBonus = () => {
    if (editingBonus) {
      setBonusHistory(prev => prev.map(bonus => 
        bonus.id === editingBonus.id ? editingBonus : bonus
      ))
      setShowEditBonusModal(false)
      setEditingBonus(null)
    }
  }

  const handleDeleteBonus = (bonusId: number) => {
    if (confirm('Are you sure you want to delete this bonus record?')) {
      setBonusHistory(prev => prev.filter(bonus => bonus.id !== bonusId))
    }
  }

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close sidebar when clicking on a tab on mobile
  const handleTabClick = (tab: 'dashboard' | 'chat' | 'trading' | 'users' | 'funds') => {
    setActiveTab(tab)
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
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
        <header className="bg-[#0f141b] border-b border-[#2a2a2a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-400">Payment Request Management</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-xl font-bold text-white">Admin</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                                     <button
                     onClick={() => setShowNotifications(!showNotifications)}
                     className="relative p-2 text-gray-400 hover:text-white transition-colors"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
                     </svg>
                    {/* Notification Badge */}
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </button>

                                     {/* Notifications Dropdown */}
                   {showNotifications && (
                     <>
                       {/* Mobile Overlay */}
                       <div 
                         className="fixed inset-0 bg-black bg-opacity-50 z-[9998] sm:hidden"
                         onClick={() => setShowNotifications(false)}
                       />
                       <div className="fixed top-20 right-2 sm:right-4 w-[calc(100vw-1rem)] sm:w-80 h-[60vh] sm:h-[55vh] bg-[#0f141b] border border-[#2a2a2a] rounded-xl shadow-2xl z-[9999] overflow-y-auto">
                      <div className="px-3 sm:px-4 py-3 border-b border-[#2a2a2a]">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-white">Notifications</h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {notifications.filter(n => !n.isRead).length} unread
                            </p>
                          </div>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="sm:hidden p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="py-2">
                        {notifications.length === 0 ? (
                          <div className="px-3 sm:px-4 py-8 text-center">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z" />
                            </svg>
                            <p className="text-sm text-gray-400">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-3 sm:px-4 py-3 hover:bg-[#181d23] transition-colors cursor-pointer ${
                                !notification.isRead ? 'bg-[#181d23]/50' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-2 sm:space-x-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${
                                    !notification.isRead ? 'text-white' : 'text-gray-300'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="px-3 sm:px-4 py-3 border-t border-[#2a2a2a]">
                          <button className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            Mark all as read
                          </button>
                        </div>
                      )}
                    </div>
                      </>
                    )}
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-2 sm:space-x-4 relative" ref={profileRef}>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-white">{profileData.fullName}</p>
                    <p className="text-xs text-gray-400">{profileData.email}</p>
                  </div>
                                   <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="h-10 w-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer overflow-hidden"
                  >
                    {profilePreview ? (
                      <img 
                        src={profilePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">A</span>
                    )}
                  </button>

                 {/* Profile Dropdown */}
                 {showProfileDropdown && (
                   <div className="absolute -top-5 right-0 sm:right-12 w-48 bg-[#0f141b] border border-[#2a2a2a] rounded-xl shadow-lg z-50">
                     <div className="py-2">
                       <button
                         onClick={() => {
                           setShowProfileModal(true)
                           setShowProfileDropdown(false)
                         }}
                         className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#181d23] transition-colors flex items-center"
                       >
                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                         </svg>
                         Edit Profile
                       </button>
                       <Link
                        href="/"
                         onClick={() => setShowProfileDropdown(false)}
                         className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#181d23] transition-colors flex items-center"
                       >
                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                         Logout
                       </Link>
                     </div>
                   </div>
                 )}
                </div>
               </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex h-screen">
          {/* Left Sidebar Navigation */}
          <div 
            ref={sidebarRef}
            className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-[#0f141b] border-r border-[#2a2a2a] p-4 sm:p-6 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
                            <div className="space-y-2">
                 <button
                   onClick={() => handleTabClick('dashboard')}
                   className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                     activeTab === 'dashboard'
                       ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                       : 'text-gray-400 hover:text-white hover:bg-[#181d23]'
                   }`}
                 >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                 </svg>
                 <span>Dashboard</span>
               </button>
               <button
                 onClick={() => handleTabClick('chat')}
                 className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                   activeTab === 'chat'
                     ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                     : 'text-gray-400 hover:text-white hover:bg-[#181d23]'
                 }`}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
                 <span>Chat Support</span>
               </button>
               <button
                 onClick={() => handleTabClick('trading')}
                 className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                   activeTab === 'trading'
                     ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                     : 'text-gray-400 hover:text-white hover:bg-[#181d23]'
                 }`}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                 </svg>
                 <span>Trading History</span>
               </button>
               <button
                 onClick={() => handleTabClick('users')}
                 className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                   activeTab === 'users'
                     ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                     : 'text-gray-400 hover:text-white hover:bg-[#181d23]'
                 }`}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                 </svg>
                 <span>Active Users</span>
               </button>
               <button
                 onClick={() => handleTabClick('funds')}
                 className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                   activeTab === 'funds'
                     ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                     : 'text-gray-400 hover:text-white hover:bg-[#181d23]'
                 }`}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                 </svg>
                 <span>Funds & Bonuses</span>
               </button>
             </div>
           </div>
           
           {/* Content Area */}
           <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

           {/* Dashboard Tab Content */}
           {activeTab === 'dashboard' && (
             <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Requests</p>
                  <p className="text-2xl font-semibold text-white">{paymentRequests.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-semibold text-white">
                    {paymentRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Approved</p>
                  <p className="text-2xl font-semibold text-white">
                    {paymentRequests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl">
                  <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Rejected</p>
                  <p className="text-2xl font-semibold text-white">
                    {paymentRequests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Status Filter
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label htmlFor="verified-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Filter
                </label>
                <select
                  id="verified-filter"
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  className="block w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Requests Table */}
          <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-lg font-medium text-white">Payment Requests</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#2a2a2a]">
                <thead className="bg-[#181d23]">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0f141b] divide-y divide-[#2a2a2a]">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-[#181d23] transition-colors">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {request.id}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{request.userName}</div>
                          <div className="text-sm text-gray-400">ID: {request.userId}</div>
                          <div className="text-xs text-gray-500">{request.description}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${request.amount.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        {new Date(request.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={getVerifiedBadge(request.isVerified)}>
                          {request.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => handleStatusChange(request.id, 'approved')}
                              className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(request.id, 'rejected')}
                              className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {request.status !== 'pending' && (
                          <span className="text-gray-500 text-xs sm:text-sm">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
             </>
           )}

           {/* Chat Tab Content */}
           {activeTab === 'chat' && (
             <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl shadow-lg overflow-hidden">
               <div className="px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
                 <div className="flex items-center justify-between">
                   <div>
                     <h2 className="text-lg font-medium text-white">Customer Support Chat</h2>
                     {selectedUser && (
                       <div className="flex items-center space-x-3 mt-2">
                         {(() => {
                           const user = activeUsers.find(u => u.id === selectedUser)
                           return user ? (
                             <>
                               <div className="relative">
                                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                   <span className="text-white font-semibold text-sm">
                                     {user.name.charAt(0)}
                                   </span>
                                 </div>
                                 <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0f141b] ${
                                   user.status === 'online' ? 'bg-green-500' :
                                   user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                                 }`}></div>
                               </div>
                               <div>
                                 <p className="text-sm font-medium text-white">{user.name}</p>
                                 <p className="text-xs text-gray-400">{user.email}</p>
                               </div>
                               <span className={`text-xs px-2 py-1 rounded-full ${
                                 user.status === 'online' ? 'bg-green-500/20 text-green-400' :
                                 user.status === 'away' ? 'bg-yellow-500/20 text-yellow-400' :
                                 'bg-gray-500/20 text-gray-400'
                               }`}>
                                 {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                               </span>
                             </>
                           ) : null
                         })()}
                       </div>
                     )}
                   </div>
                   {selectedUser && (
                     <button
                       onClick={() => {
                         setSelectedUser(null)
                         setActiveTab('users')
                       }}
                       className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                       </svg>
                       <span>Back to Users</span>
                     </button>
                   )}
                 </div>
               </div>
               
               {!selectedUser ? (
                 <div className="h-96 flex items-center justify-center">
                   <div className="text-center px-4">
                     <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                     </svg>
                     <p className="text-gray-400 mb-2 text-sm sm:text-base">No user selected</p>
                     <p className="text-xs sm:text-sm text-gray-500">Go to Active Users to select a user to chat with</p>
                     <button
                       onClick={() => handleTabClick('users')}
                       className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 text-sm sm:text-base"
                     >
                       Select User
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="h-96 flex flex-col">
                   {/* Chat Messages */}
                   <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {chatMessages
                       .filter(message => message.userId === selectedUser || message.userId === 'admin')
                       .map((message) => (
                         <div
                           key={message.id}
                           className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                         >
                           <div
                             className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                               message.isAdmin
                                 ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                                 : 'bg-[#181d23] text-white'
                             }`}
                           >
                             <div className="text-xs text-gray-300 mb-1">{message.userName}</div>
                             <div className="text-sm">{message.message}</div>
                             <div className="text-xs text-gray-400 mt-1">
                               {new Date(message.timestamp).toLocaleTimeString()}
                             </div>
                           </div>
                         </div>
                       ))}
                   </div>
                   {/* Message Input */}
                   <div className="border-t border-[#2a2a2a] p-4">
                     <div className="flex space-x-2">
                       <input
                         type="text"
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                         placeholder="Type your message..."
                         className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                       />
                       <button
                         onClick={handleSendMessage}
                         className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 text-sm sm:text-base"
                       >
                         Send
                       </button>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           )}

           {/* Trading History Tab Content */}
           {activeTab === 'trading' && (
             <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl shadow-lg overflow-hidden">
               <div className="px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
                 <h2 className="text-lg font-medium text-white">All Users Trading History</h2>
                 <p className="text-sm text-gray-400 mt-1">Monitor all trading activities across the platform</p>
               </div>
               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-[#2a2a2a]">
                                    <thead className="bg-[#181d23]">
                   <tr>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       User
                     </th>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Symbol
                     </th>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Type
                     </th>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Amount
                     </th>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Price
                     </th>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Total
                     </th>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Status
                     </th>
                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Time
                     </th>
                   </tr>
                 </thead>
                                        <tbody className="bg-[#0f141b] divide-y divide-[#2a2a2a]">
                       {tradingHistory.map((trade) => (
                         <tr key={trade.id} className="hover:bg-[#181d23] transition-colors">
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                             <div>
                               <div className="text-sm font-medium text-white">{trade.userName}</div>
                               <div className="text-sm text-gray-400">ID: {trade.userId}</div>
                             </div>
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                             {trade.symbol}
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                               trade.type === 'buy'
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                 : 'bg-red-500/20 text-red-400 border border-red-500/30'
                             }`}>
                               {trade.type.toUpperCase()}
                             </span>
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                             {trade.amount}
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                             ${trade.price.toLocaleString()}
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                             ${trade.total.toLocaleString()}
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                               trade.status === 'completed'
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                 : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                             }`}>
                               {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                             </span>
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                             {new Date(trade.timestamp).toLocaleString()}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                 </table>
               </div>
             </div>
           )}

           {/* Active Users Tab Content */}
           {activeTab === 'users' && (
             <div className="space-y-4 sm:space-y-6">
               {/* Header */}
               <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 shadow-lg">
                 <h2 className="text-lg font-medium text-white">Active Users</h2>
                 <p className="text-sm text-gray-400 mt-1">Select a user to start a chat conversation</p>
               </div>

               {/* Users Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {activeUsers.map((user) => (
                   <div
                     key={user.id}
                     onClick={() => {
                       setSelectedUser(user.id)
                       handleTabClick('chat')
                     }}
                     className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 shadow-lg hover:border-blue-500/50 transition-all duration-200 cursor-pointer group"
                   >
                     <div className="flex items-center space-x-4">
                       {/* Avatar */}
                       <div className="relative">
                         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                           <span className="text-white font-semibold text-lg">
                             {user.name.charAt(0)}
                           </span>
                         </div>
                         {/* Status Indicator */}
                         <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0f141b] ${
                           user.status === 'online' ? 'bg-green-500' :
                           user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                         }`}></div>
                       </div>

                       {/* User Info */}
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between">
                           <h3 className="text-sm font-medium text-white truncate">{user.name}</h3>
                           {user.unreadMessages > 0 && (
                             <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                               {user.unreadMessages}
                             </span>
                           )}
                         </div>
                         <p className="text-xs text-gray-400 truncate">{user.email}</p>
                         <div className="flex items-center space-x-2 mt-1">
                           <span className={`text-xs px-2 py-1 rounded-full ${
                             user.status === 'online' ? 'bg-green-500/20 text-green-400' :
                             user.status === 'away' ? 'bg-yellow-500/20 text-yellow-400' :
                             'bg-gray-500/20 text-gray-400'
                           }`}>
                             {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                           </span>
                           <span className="text-xs text-gray-500">• {user.lastSeen}</span>
                         </div>
                       </div>

                       {/* Chat Icon */}
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                         </svg>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Stats */}
               <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 shadow-lg">
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   <div className="text-center">
                     <div className="text-2xl font-bold text-white">{activeUsers.length}</div>
                     <div className="text-sm text-gray-400">Total Users</div>
                   </div>
                   <div className="text-center">
                     <div className="text-2xl font-bold text-green-400">
                       {activeUsers.filter(u => u.status === 'online').length}
                     </div>
                     <div className="text-sm text-gray-400">Online</div>
                   </div>
                   <div className="text-center">
                     <div className="text-2xl font-bold text-yellow-400">
                       {activeUsers.filter(u => u.status === 'away').length}
                     </div>
                     <div className="text-sm text-gray-400">Away</div>
                   </div>
                   <div className="text-center">
                     <div className="text-2xl font-bold text-red-400">
                       {activeUsers.reduce((sum, user) => sum + user.unreadMessages, 0)}
                     </div>
                     <div className="text-sm text-gray-400">Unread Messages</div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Funds & Bonuses Tab Content */}
           {activeTab === 'funds' && (
             <div className="space-y-2 max-w-full">
               {/* Header */}
               {/* <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
                 <h2 className="text-lg font-medium text-white">Funds & Bonuses Management</h2>
                 <p className="text-sm text-gray-400 mt-1">Configure daily bonuses, deposit limits, and manage bonus history</p>
               </div>  */}

               {/* Sub Navigation Tabs */}
               <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-1 shadow-lg">
                 <div className="flex space-x-1">
                   <button
                     onClick={() => setFundsSubTab('funds')}
                     className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                       fundsSubTab === 'funds'
                         ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                         : 'text-gray-400 hover:text-white hover:bg-[#181d23]'
                     }`}
                   >
                     <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                       </svg>
                       <span className="hidden sm:inline">Funds Settings</span>
                       <span className="sm:hidden">Funds</span>
                     </div>
                   </button>
                   <button
                     onClick={() => setFundsSubTab('bonuses')}
                     className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                       fundsSubTab === 'bonuses'
                         ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                         : 'text-gray-400 hover:text-white hover:bg-[#181d23]'
                     }`}
                   >
                     <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <span className="hidden sm:inline">Bonus History</span>
                       <span className="sm:hidden">Bonuses</span>
                     </div>
                   </button>
                 </div>
               </div>

               {/* Funds Settings Tab */}
               {fundsSubTab === 'funds' && (
                 <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl shadow-lg">
                   <div className="px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div>
                         <h3 className="text-lg font-medium text-white">Funds Configuration</h3>
                         <p className="text-sm text-gray-400 mt-1">Manage daily bonuses, deposit limits, and bonus percentages</p>
                       </div>
                       <button
                         onClick={handleEditFunds}
                         className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                         <span>Edit Settings</span>
                       </button>
                     </div>
                   </div>
                   <div className="p-4 sm:p-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                       {/* Daily Bonus Card */}
                       <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                         <div className="flex items-center justify-between mb-4">
                           <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                             <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                             </svg>
                           </div>
                           <span className="text-xs text-purple-400 font-medium">Daily</span>
                         </div>
                         <h4 className="text-sm font-medium text-gray-400 mb-2">Daily Bonus</h4>
                         <p className="text-2xl font-bold text-white">${fundsData.dailyBonus}</p>
                         <p className="text-xs text-gray-500 mt-1">Per user per day</p>
                       </div>

                       {/* Max Daily Bonus Card */}
                       <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                         <div className="flex items-center justify-between mb-4">
                           <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                             <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                             </svg>
                           </div>
                           <span className="text-xs text-blue-400 font-medium">Limit</span>
                         </div>
                         <h4 className="text-sm font-medium text-gray-400 mb-2">Max Daily Bonus</h4>
                         <p className="text-2xl font-bold text-white">${fundsData.maxDailyBonus}</p>
                         <p className="text-xs text-gray-500 mt-1">Maximum per day</p>
                       </div>

                       {/* Bonus Percentage Card */}
                       <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                         <div className="flex items-center justify-between mb-4">
                           <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                             <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                             </svg>
                           </div>
                           <span className="text-xs text-green-400 font-medium">Rate</span>
                         </div>
                         <h4 className="text-sm font-medium text-gray-400 mb-2">Bonus Percentage</h4>
                         <p className="text-2xl font-bold text-white">{fundsData.bonusPercentage}%</p>
                         <p className="text-xs text-gray-500 mt-1">On deposits</p>
                       </div>

                       {/* Max Bonus Amount Card */}
                       <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                         <div className="flex items-center justify-between mb-4">
                           <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                             <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                             </svg>
                           </div>
                           <span className="text-xs text-yellow-400 font-medium">Max</span>
                         </div>
                         <h4 className="text-sm font-medium text-gray-400 mb-2">Max Bonus Amount</h4>
                         <p className="text-2xl font-bold text-white">${fundsData.maxBonusAmount}</p>
                         <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                       </div>

                       {/* Min Deposit Card */}
                       <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                         <div className="flex items-center justify-between mb-4">
                           <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                             <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                           </div>
                           <span className="text-xs text-red-400 font-medium">Min</span>
                         </div>
                         <h4 className="text-sm font-medium text-gray-400 mb-2">Min Deposit</h4>
                         <p className="text-2xl font-bold text-white">${fundsData.minDeposit}</p>
                         <p className="text-xs text-gray-500 mt-1">Minimum amount</p>
                       </div>

                       {/* Max Deposit Card */}
                       <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                         <div className="flex items-center justify-between mb-4">
                           <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                             <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                             </svg>
                           </div>
                           <span className="text-xs text-indigo-400 font-medium">Max</span>
                         </div>
                         <h4 className="text-sm font-medium text-gray-400 mb-2">Max Deposit</h4>
                         <p className="text-2xl font-bold text-white">${fundsData.maxDeposit}</p>
                         <p className="text-xs text-gray-500 mt-1">Maximum amount</p>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {/* Bonus History Tab */}
               {fundsSubTab === 'bonuses' && (
                 <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl shadow-lg">
                   <div className="px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div>
                         <h3 className="text-lg font-medium text-white">Bonus History</h3>
                         <p className="text-sm text-gray-400 mt-1">Track all bonus distributions and manage records</p>
                       </div>
                       <div className="flex items-center space-x-2">
                         <span className="text-sm text-gray-400">
                           Total: {bonusHistory.length} records
                         </span>
                       </div>
                     </div>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-[#2a2a2a]">
                       <thead className="bg-[#181d23]">
                         <tr>
                           <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                             User
                           </th>
                           <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                             Type
                           </th>
                           <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                             Amount
                           </th>
                           <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                             Date
                           </th>
                           <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                             Status
                           </th>
                           <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                             Actions
                           </th>
                         </tr>
                       </thead>
                                                <tbody className="bg-[#0f141b] divide-y divide-[#2a2a2a]">
                           {bonusHistory.map((bonus) => (
                             <tr key={bonus.id} className="hover:bg-[#181d23] transition-colors">
                               <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center">
                                   <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                                     <span className="text-white font-semibold text-sm">
                                       {bonus.userName.charAt(0)}
                                     </span>
                                   </div>
                                   <div>
                                     <div className="text-sm font-medium text-white">{bonus.userName}</div>
                                     <div className="text-sm text-gray-400">ID: {bonus.userId}</div>
                                   </div>
                                 </div>
                               </td>
                               <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                   bonus.type === 'daily_bonus' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                   bonus.type === 'deposit_bonus' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                   'bg-green-500/20 text-green-400 border border-green-500/30'
                                 }`}>
                                   {bonus.type.charAt(0).toUpperCase() + bonus.type.slice(1)}
                                 </span>
                               </td>
                               <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm font-bold text-white">${bonus.amount}</div>
                               </td>
                               <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                 {new Date(bonus.date).toLocaleDateString()}
                               </td>
                               <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                   bonus.status === 'credited'
                                     ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                     : bonus.status === 'pending'
                                     ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                     : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                 }`}>
                                   {bonus.status.charAt(0).toUpperCase() + bonus.status.slice(1)}
                                 </span>
                               </td>
                               <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                 <div className="flex space-x-2">
                                   <button
                                     onClick={() => handleEditBonus(bonus)}
                                     className="text-blue-400 hover:text-blue-300 transition-colors p-1 hover:bg-blue-500/10 rounded"
                                     title="Edit"
                                   >
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                     </svg>
                                   </button>
                                   <button
                                     onClick={() => handleDeleteBonus(bonus.id)}
                                     className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded"
                                     title="Delete"
                                   >
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                     </svg>
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                     </table>
                   </div>
                 </div>
               )}
             </div>
           )}
           </div>
         </main>
       </div>

       {/* Profile Edit Modal */}
       {showProfileModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl lg:text-2xl font-bold text-white">Edit Profile</h2>
               <button
                 onClick={() => setShowProfileModal(false)}
                 className="text-gray-400 hover:text-white transition-colors"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <form onSubmit={(e) => { e.preventDefault(); setShowProfileModal(false) }}>
                               {/* Profile Picture */}
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Picture
                  </label>
                                     <div className="flex items-center space-x-4">
                   <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center overflow-hidden">
                       {profilePreview ? (
                         <img 
                           src={profilePreview} 
                           alt="Profile Preview" 
                           className="w-full h-full object-cover"
                         />
                       ) : (
                       <span className="text-white font-semibold text-xl">A</span>
                       )}
                     </div>
                    <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                       className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
                     />
                     {profilePreview && (
                           <button
                             type="button"
                             onClick={clearProfilePicture}
                             className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center"
                           >
                             <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                             Remove
                           </button>
                       )}
                    </div>
                  </div>
                </div>

               {/* Full Name */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Full Name
                 </label>
                 <input
                   type="text"
                   value={profileData.fullName}
                   onChange={(e) => handleInputChange('fullName', e.target.value)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter your full name"
                 />
               </div>

               {/* Email */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Email
                 </label>
                 <input
                   type="email"
                   value={profileData.email}
                   onChange={(e) => handleInputChange('email', e.target.value)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter your email"
                 />
               </div>

               {/* Current Password */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Current Password
                 </label>
                 <input
                   type="password"
                   value={profileData.currentPassword}
                   onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter current password"
                 />
               </div>

               {/* New Password */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   New Password
                 </label>
                 <input
                   type="password"
                   value={profileData.newPassword}
                   onChange={(e) => handleInputChange('newPassword', e.target.value)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter new password"
                 />
               </div>

               {/* Confirm New Password */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Confirm New Password
                 </label>
                 <input
                   type="password"
                   value={profileData.confirmPassword}
                   onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Confirm new password"
                 />
               </div>

               {/* Submit Button */}
               <button
                 type="submit"
                 className="w-full mt-6 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200"
               >
                 Update Profile
               </button>
             </form>
           </div>
         </div>
       )}

       {/* Edit Funds Modal */}
       {showEditFundsModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl lg:text-2xl font-bold text-white">Edit Funds Settings</h2>
               <button
                 onClick={() => setShowEditFundsModal(false)}
                 className="text-gray-400 hover:text-white transition-colors"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <div className="space-y-4">
               {/* Daily Bonus */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Daily Bonus Amount ($)
                 </label>
                 <input
                   type="number"
                   value={editFundsData.dailyBonus}
                   onChange={(e) => setEditFundsData(prev => ({ ...prev, dailyBonus: Number(e.target.value) }))}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter daily bonus amount"
                 />
               </div>

               {/* Max Daily Bonus */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Max Daily Bonus ($)
                 </label>
                 <input
                   type="number"
                   value={editFundsData.maxDailyBonus}
                   onChange={(e) => setEditFundsData(prev => ({ ...prev, maxDailyBonus: Number(e.target.value) }))}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter max daily bonus"
                 />
               </div>

               {/* Bonus Percentage */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Bonus Percentage (%)
                 </label>
                 <input
                   type="number"
                   value={editFundsData.bonusPercentage}
                   onChange={(e) => setEditFundsData(prev => ({ ...prev, bonusPercentage: Number(e.target.value) }))}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter bonus percentage"
                 />
               </div>

               {/* Max Bonus Amount */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Max Bonus Amount ($)
                 </label>
                 <input
                   type="number"
                   value={editFundsData.maxBonusAmount}
                   onChange={(e) => setEditFundsData(prev => ({ ...prev, maxBonusAmount: Number(e.target.value) }))}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter max bonus amount"
                 />
               </div>

               {/* Min Deposit */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Minimum Deposit ($)
                 </label>
                 <input
                   type="number"
                   value={editFundsData.minDeposit}
                   onChange={(e) => setEditFundsData(prev => ({ ...prev, minDeposit: Number(e.target.value) }))}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter minimum deposit"
                 />
               </div>

               {/* Max Deposit */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Maximum Deposit ($)
                 </label>
                 <input
                   type="number"
                   value={editFundsData.maxDeposit}
                   onChange={(e) => setEditFundsData(prev => ({ ...prev, maxDeposit: Number(e.target.value) }))}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter maximum deposit"
                 />
               </div>

               {/* Action Buttons */}
               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={handleSaveFunds}
                   className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                 >
                   Save Changes
                 </button>
                 <button
                   onClick={() => setShowEditFundsModal(false)}
                   className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-700 transition-all duration-200"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Bonus Modal */}
       {showEditBonusModal && editingBonus && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl lg:text-2xl font-bold text-white">Edit Bonus Record</h2>
               <button
                 onClick={() => setShowEditBonusModal(false)}
                 className="text-gray-400 hover:text-white transition-colors"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <div className="space-y-4">
               {/* User Name */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   User Name
                 </label>
                 <input
                   type="text"
                   value={editingBonus.userName}
                   onChange={(e) => setEditingBonus((prev: BonusRecord | null) => prev ? { ...prev, userName: e.target.value } as BonusRecord : null)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter user name"
                 />
               </div>

               {/* Bonus Type */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Bonus Type
                 </label>
                 <select
                   value={editingBonus.type}
                   onChange={(e) => setEditingBonus((prev: BonusRecord | null) => prev ? { ...prev, type: e.target.value } as BonusRecord : null)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 >
                   <option value="daily_bonus">Daily Bonus</option>
                   <option value="deposit_bonus">Deposit Bonus</option>
                   <option value="referral_bonus">Referral Bonus</option>
                   <option value="promotional_bonus">Promotional Bonus</option>
                 </select>
               </div>

               {/* Amount */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Amount ($)
                 </label>
                 <input
                   type="number"
                   value={editingBonus.amount}
                   onChange={(e) => setEditingBonus((prev: BonusRecord | null) => prev ? { ...prev, amount: Number(e.target.value) } as BonusRecord : null)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter bonus amount"
                 />
               </div>

               {/* Date */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Date
                 </label>
                 <input
                   type="date"
                   value={editingBonus.date}
                   onChange={(e) => setEditingBonus((prev: BonusRecord | null) => prev ? { ...prev, date: e.target.value } as BonusRecord : null)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>

               {/* Status */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Status
                 </label>
                 <select
                   value={editingBonus.status}
                   onChange={(e) => setEditingBonus((prev: BonusRecord | null) => prev ? { ...prev, status: e.target.value } as BonusRecord : null)}
                   className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 >
                   <option value="credited">Credited</option>
                   <option value="pending">Pending</option>
                   <option value="cancelled">Cancelled</option>
                 </select>
               </div>

               {/* Action Buttons */}
               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={handleSaveBonus}
                   className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                 >
                   Save Changes
                 </button>
                 <button
                   onClick={() => setShowEditBonusModal(false)}
                   className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-700 transition-all duration-200"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
