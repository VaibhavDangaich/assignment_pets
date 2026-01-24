'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './bookings.module.css'

export default function BookingsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in')
            return
        }

        async function fetchBookings() {
            try {
                const res = await fetch('/api/bookings')
                const data = await res.json()
                setBookings(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Error fetching bookings:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchBookings()
        }
    }, [user, isLoaded, router])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusClass = (status) => {
        const classes = {
            confirmed: styles.statusConfirmed,
            pending: styles.statusPending,
            cancelled: styles.statusCancelled
        }
        return classes[status] || ''
    }

    if (!isLoaded || loading) {
        return (
            <div className="loading-container" style={{ minHeight: '50vh' }}>
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>My Bookings</h1>
                <p>View and manage your event registrations and service appointments</p>
            </div>

            {bookings.length > 0 ? (
                <div className={styles.bookingsList}>
                    {bookings.map((booking) => (
                        <div key={booking._id} className={styles.bookingCard}>
                            <div className={styles.bookingIcon}>
                                {booking.bookingType === 'event' ? '📅' : '🐾'}
                            </div>

                            <div className={styles.bookingInfo}>
                                <div className={styles.bookingType}>
                                    {booking.bookingType === 'event' ? 'Event' : 'Service'}
                                </div>
                                <h3 className={styles.bookingTitle}>
                                    {booking.bookingType === 'event'
                                        ? booking.eventId?.title || 'Event Booking'
                                        : booking.serviceName || 'Service Appointment'}
                                </h3>
                                {booking.bookingType === 'service' && booking.serviceProviderId && (
                                    <p className={styles.provider}>
                                        at {booking.serviceProviderId.name}
                                    </p>
                                )}
                                <div className={styles.bookingDetails}>
                                    <span>📅 {formatDate(booking.date)}</span>
                                    <span>⏰ {booking.time}</span>
                                </div>
                            </div>

                            <div className={styles.bookingMeta}>
                                <span className={`${styles.status} ${getStatusClass(booking.status)}`}>
                                    {booking.status}
                                </span>
                                <div className={styles.pricing}>
                                    {booking.discountApplied > 0 && (
                                        <span className={styles.originalPrice}>₹{booking.originalPrice}</span>
                                    )}
                                    <span className={styles.finalPrice}>₹{booking.finalPrice?.toFixed(2)}</span>
                                </div>
                                {booking.discountApplied > 0 && (
                                    <span className={styles.discountBadge}>
                                        {booking.discountApplied}% saved
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3>No bookings yet</h3>
                    <p>Start exploring events and services to make your first booking</p>
                    <div className={styles.emptyActions}>
                        <Link href="/events" className="btn btn-primary">
                            Browse Events
                        </Link>
                        <Link href="/services" className="btn btn-secondary">
                            Find Services
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
