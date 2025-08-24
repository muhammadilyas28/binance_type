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

export default function AdminDashboard() {
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

  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-400">Payment Request Management</p>
                </div>
              </div>
                             <div className="flex items-center space-x-4 relative" ref={profileRef}>
                 <div className="text-right">
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
                   <div className="absolute -top-5 right-12 w-48 bg-[#0f141b] border border-[#2a2a2a] rounded-xl shadow-lg z-50">
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
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-6 mb-8 shadow-lg">
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
            <div className="px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-lg font-medium text-white">Payment Requests</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#2a2a2a]">
                <thead className="bg-[#181d23]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0f141b] divide-y divide-[#2a2a2a]">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-[#181d23] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{request.userName}</div>
                          <div className="text-sm text-gray-400">ID: {request.userId}</div>
                          <div className="text-xs text-gray-500">{request.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${request.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {new Date(request.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getVerifiedBadge(request.isVerified)}>
                          {request.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(request.id, 'approved')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(request.id, 'rejected')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {request.status !== 'pending' && (
                          <span className="text-gray-500">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

         </main>
       </div>

       {/* Profile Edit Modal */}
       {showProfileModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-[#0f141b] border border-[#2a2a2a] rounded-2xl p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
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

             <form onSubmit={handleProfileUpdate} className="space-y-4">
                               {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Picture
                  </label>
                                     <div className="flex items-center space-x-4">
                     <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center overflow-hidden">
                       {profilePreview ? (
                         <img 
                           src={profilePreview} 
                           alt="Profile Preview" 
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <span className="text-white font-bold text-xl">A</span>
                       )}
                     </div>
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <div className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white hover:bg-[#3a3a3a] transition-colors flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-medium">
                            {profileData.profilePicture ? profileData.profilePicture.name : 'Choose Image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                                             {profileData.profilePicture && (
                         <div className="mt-2 flex items-center justify-between">
                           <p className="text-xs text-green-400 flex items-center">
                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                             File selected: {profileData.profilePicture.name}
                           </p>
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
                         </div>
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
     </div>
   )
 }
