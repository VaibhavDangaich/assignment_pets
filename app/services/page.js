'use client'

import { useEffect, useState } from 'react'
import ServiceCard from '@/components/ServiceCard'
import styles from './services.module.css'

export default function ServicesPage() {
    const [providers, setProviders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        async function fetchProviders() {
            try {
                const url = filter === 'all'
                    ? '/api/services'
                    : `/api/services?type=${filter}`
                const res = await fetch(url)
                const data = await res.json()
                setProviders(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Error fetching providers:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProviders()
    }, [filter])

    const serviceTypes = [
        { value: 'all', label: 'All Services', icon: '🐾' },
        { value: 'veterinarian', label: 'Veterinarians', icon: '🩺' },
        { value: 'groomer', label: 'Groomers', icon: '✂️' },
        { value: 'trainer', label: 'Trainers', icon: '🦮' }
    ]

    return (
        <div className="container">
            <div className="page-header">
                <h1>Pet Services</h1>
                <p>Find trusted veterinarians, groomers, and trainers for your furry friends</p>
            </div>

            <div className={styles.filters}>
                {serviceTypes.map((type) => (
                    <button
                        key={type.value}
                        className={`${styles.filterBtn} ${filter === type.value ? styles.active : ''}`}
                        onClick={() => setFilter(type.value)}
                    >
                        <span>{type.icon}</span>
                        {type.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : providers.length > 0 ? (
                <div className="grid grid-3" style={{ paddingBottom: '60px' }}>
                    {providers.map((provider) => (
                        <ServiceCard key={provider._id} provider={provider} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐾</div>
                    <h3>No service providers found</h3>
                    <p>Check back later for new providers or try a different filter</p>
                </div>
            )}
        </div>
    )
}
