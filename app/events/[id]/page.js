'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import styles from './event.module.css'

export default function EventDetailPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const params = useParams()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState(false)
    const [booked, setBooked] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await fetch(`/api/events/${params.id}`)
                const data = await res.json()
                if (res.ok) {
                    setEvent(data)
                }
            } catch (error) {
                console.error('Error fetching event:', error)
            } finally {
                setLoading(false)
            }
        }
        if (params.id) {
            fetchEvent()
        }
    }, [params.id])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getTypeIcon = (type) => {
        const icons = {
            training: '🎓',
            adoption: '🏠',
            meetup: '🐕',
            competition: '🏆'
        }
        return icons[type] || '📅'
    }

    const discountedPrice = event?.discountPercent > 0
        ? event.price * (1 - event.discountPercent / 100)
        : event?.price

    const handleBooking = async () => {
        if (!user) {
            router.push('/sign-in')
            return
        }

        setBooking(true)
        setError('')

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingType: 'event',
                    eventId: event._id,
                    date: event.date,
                    time: event.time,
                    originalPrice: event.price,
                    discountApplied: event.discountPercent,
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

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '50vh' }}>
                <div className="spinner"></div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="container">
                <div className="empty-state">
                    <h3>Event not found</h3>
                    <Link href="/events" className="btn btn-primary">
                        Back to Events
                    </Link>
                </div>
            </div>
        )
    }

    const slotsLeft = event.totalSlots - event.bookedSlots

    return (
        <div className={styles.container}>
            <Link href="/events" className={styles.backLink}>
                ← Back to Events
            </Link>

            <div className={styles.layout}>
                <div className={styles.main}>
                    <div className={styles.hero}>
                        <div
                            className={styles.heroImage}
                            style={{
                                backgroundImage: event.image
                                    ? `url(${event.image})`
                                    : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                            }}
                        >
                            <span className={styles.heroIcon}>{getTypeIcon(event.type)}</span>
                        </div>
                        {event.discountPercent > 0 && (
                            <div className={styles.discountBadge}>
                                {event.discountPercent}% OFF for Subscribers
                            </div>
                        )}
                    </div>

                    <div className={styles.content}>
                        <div className={styles.meta}>
                            <span className={styles.type}>{event.type}</span>
                            <span className={styles.provider}>by {event.providerName}</span>
                        </div>

                        <h1 className={styles.title}>{event.title}</h1>

                        <div className={styles.details}>
                            <div className={styles.detail}>
                                <span className={styles.detailIcon}>📅</span>
                                <div>
                                    <span className={styles.detailLabel}>Date</span>
                                    <span className={styles.detailValue}>{formatDate(event.date)}</span>
                                </div>
                            </div>
                            <div className={styles.detail}>
                                <span className={styles.detailIcon}>⏰</span>
                                <div>
                                    <span className={styles.detailLabel}>Time</span>
                                    <span className={styles.detailValue}>{event.time}</span>
                                </div>
                            </div>
                            <div className={styles.detail}>
                                <span className={styles.detailIcon}>📍</span>
                                <div>
                                    <span className={styles.detailLabel}>Location</span>
                                    <span className={styles.detailValue}>{event.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.description}>
                            <h2>About This Event</h2>
                            <p>{event.description}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.priceSection}>
                            {event.discountPercent > 0 && (
                                <span className={styles.originalPrice}>₹{event.price}</span>
                            )}
                            <span className={styles.price}>₹{discountedPrice?.toFixed(2)}</span>
                            <span className={styles.perPerson}>per person</span>
                        </div>

                        <div className={styles.slotsInfo}>
                            <div className={styles.slotsBar}>
                                <div
                                    className={styles.slotsProgress}
                                    style={{ width: `${(event.bookedSlots / event.totalSlots) * 100}%` }}
                                ></div>
                            </div>
                            <span className={`${styles.slotsText} ${slotsLeft < 5 ? styles.slotsLow : ''}`}>
                                {slotsLeft} of {event.totalSlots} slots available
                            </span>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        {booked ? (
                            <div className={styles.successMessage}>
                                <span>✓</span> Booking Confirmed!
                                <Link href="/bookings" className={styles.viewBookingsLink}>
                                    View My Bookings
                                </Link>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary btn-block btn-lg"
                                onClick={handleBooking}
                                disabled={booking || slotsLeft === 0}
                            >
                                {booking ? 'Booking...' : slotsLeft === 0 ? 'Fully Booked' : 'Book Now'}
                            </button>
                        )}

                        {!user && (
                            <p className={styles.loginPrompt}>
                                <Link href="/sign-in">Sign in</Link> to book this event
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
