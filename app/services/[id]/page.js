'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import styles from './service.module.css'

export default function ServiceDetailPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const params = useParams()
    const [provider, setProvider] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedService, setSelectedService] = useState(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [booking, setBooking] = useState(false)
    const [booked, setBooked] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchProvider() {
            try {
                const res = await fetch(`/api/services/${params.id}`)
                const data = await res.json()
                if (res.ok) {
                    setProvider(data)
                }
            } catch (error) {
                console.error('Error fetching provider:', error)
            } finally {
                setLoading(false)
            }
        }
        if (params.id) {
            fetchProvider()
        }
    }, [params.id])

    const getTypeIcon = (type) => {
        const icons = {
            veterinarian: '🩺',
            groomer: '✂️',
            trainer: '🦮'
        }
        return icons[type] || '🐾'
    }

    const renderStars = (rating) => {
        const stars = []
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
                    ★
                </span>
            )
        }
        return stars
    }

    const getDiscountedPrice = (price) => {
        if (provider?.discountPercent > 0) {
            return price * (1 - provider.discountPercent / 100)
        }
        return price
    }

    const handleBooking = async () => {
        if (!session) {
            router.push('/login')
            return
        }

        if (!session.user.isSubscribed) {
            router.push('/subscription')
            return
        }

        if (!selectedService || !selectedDate || !selectedTime) {
            setError('Please select a service, date, and time')
            return
        }

        setBooking(true)
        setError('')

        try {
            const discountedPrice = getDiscountedPrice(selectedService.price)

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingType: 'service',
                    serviceProviderId: provider._id,
                    serviceName: selectedService.name,
                    date: selectedDate,
                    time: selectedTime,
                    originalPrice: selectedService.price,
                    discountApplied: provider.discountPercent || 0,
                    finalPrice: discountedPrice
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Booking failed')
            }

            setBooked(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setBooking(false)
        }
    }

    const getNextDays = () => {
        const days = []
        for (let i = 1; i <= 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i)
            days.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            })
        }
        return days
    }

    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '50vh' }}>
                <div className="spinner"></div>
            </div>
        )
    }

    if (!provider) {
        return (
            <div className="container">
                <div className="empty-state">
                    <h3>Service provider not found</h3>
                    <Link href="/services" className="btn btn-primary">
                        Back to Services
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Link href="/services" className={styles.backLink}>
                ← Back to Services
            </Link>

            <div className={styles.layout}>
                <div className={styles.main}>
                    <div className={styles.header}>
                        <div
                            className={styles.avatar}
                            style={{
                                backgroundImage: provider.image
                                    ? `url(${provider.image})`
                                    : undefined
                            }}
                        >
                            {!provider.image && <span>{getTypeIcon(provider.type)}</span>}
                        </div>
                        <div className={styles.info}>
                            <span className={styles.type}>{provider.type}</span>
                            <h1 className={styles.name}>{provider.name}</h1>
                            <div className={styles.rating}>
                                <div className={styles.stars}>{renderStars(provider.rating)}</div>
                                <span>{provider.rating?.toFixed(1) || '0.0'} rating</span>
                            </div>
                        </div>
                        {provider.discountPercent > 0 && (
                            <div className={styles.discountBadge}>
                                {provider.discountPercent}% OFF
                            </div>
                        )}
                    </div>

                    <div className={styles.details}>
                        <div className={styles.detail}>
                            <span className={styles.detailIcon}>📍</span>
                            <div>
                                <span className={styles.detailLabel}>Address</span>
                                <span className={styles.detailValue}>{provider.address}</span>
                            </div>
                        </div>
                        {provider.phone && (
                            <div className={styles.detail}>
                                <span className={styles.detailIcon}>📞</span>
                                <div>
                                    <span className={styles.detailLabel}>Phone</span>
                                    <span className={styles.detailValue}>{provider.phone}</span>
                                </div>
                            </div>
                        )}
                        {provider.email && (
                            <div className={styles.detail}>
                                <span className={styles.detailIcon}>✉️</span>
                                <div>
                                    <span className={styles.detailLabel}>Email</span>
                                    <span className={styles.detailValue}>{provider.email}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.description}>
                        <h2>About</h2>
                        <p>{provider.description}</p>
                    </div>

                    <div className={styles.servicesSection}>
                        <h2>Services Offered</h2>
                        <div className={styles.servicesList}>
                            {provider.services?.map((service, index) => (
                                <div
                                    key={index}
                                    className={`${styles.serviceItem} ${selectedService?.name === service.name ? styles.selected : ''}`}
                                    onClick={() => setSelectedService(service)}
                                >
                                    <div className={styles.serviceInfo}>
                                        <h3>{service.name}</h3>
                                        <span className={styles.duration}>{service.duration} mins</span>
                                    </div>
                                    <div className={styles.servicePrice}>
                                        {provider.discountPercent > 0 && (
                                            <span className={styles.originalPrice}>₹{service.price}</span>
                                        )}
                                        <span className={styles.currentPrice}>
                                            ₹{getDiscountedPrice(service.price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <h2>Book Appointment</h2>

                        {booked ? (
                            <div className={styles.successMessage}>
                                <span>✓</span> Appointment Booked!
                                <Link href="/bookings" className={styles.viewBookingsLink}>
                                    View My Bookings
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className={styles.bookingSection}>
                                    <h3>Selected Service</h3>
                                    {selectedService ? (
                                        <div className={styles.selectedService}>
                                            <span>{selectedService.name}</span>
                                            <span>₹{getDiscountedPrice(selectedService.price).toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <p className={styles.selectPrompt}>Select a service from the list</p>
                                    )}
                                </div>

                                <div className={styles.bookingSection}>
                                    <h3>Select Date</h3>
                                    <div className={styles.dateGrid}>
                                        {getNextDays().map((day) => (
                                            <button
                                                key={day.value}
                                                className={`${styles.dateBtn} ${selectedDate === day.value ? styles.selected : ''}`}
                                                onClick={() => setSelectedDate(day.value)}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.bookingSection}>
                                    <h3>Select Time</h3>
                                    <div className={styles.timeGrid}>
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                className={`${styles.timeBtn} ${selectedTime === time ? styles.selected : ''}`}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && <div className={styles.error}>{error}</div>}

                                <button
                                    className="btn btn-primary btn-block btn-lg"
                                    onClick={handleBooking}
                                    disabled={booking || !selectedService}
                                >
                                    {booking ? 'Booking...' : 'Confirm Booking'}
                                </button>

                                {!session && (
                                    <p className={styles.loginPrompt}>
                                        <Link href="/login">Sign in</Link> to book an appointment
                                    </p>
                                )}

                                {session && !session.user.isSubscribed && (
                                    <p className={styles.subscribePrompt}>
                                        <Link href="/subscription">Subscribe</Link> to book with discounts
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
