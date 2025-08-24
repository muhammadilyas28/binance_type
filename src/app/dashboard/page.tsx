'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to overview page
        router.push('/dashboard/overview')
    }, [router])

    return null
}
