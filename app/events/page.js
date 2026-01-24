'use client'

import { useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'
import styles from './events.module.css'

export default function EventsPage() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        async function fetchEvents() {
            try {
                const url = filter === 'all'
                    ? '/api/events'
                    : `/api/events?type=${filter}`
                const res = await fetch(url)
                const data = await res.json()
                setEvents(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Error fetching events:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [filter])

    const eventTypes = [
        { value: 'all', label: 'All Events', icon: '📅' },
        { value: 'training', label: 'Training', icon: '🎓' },
        { value: 'adoption', label: 'Adoption', icon: '🏠' },
        { value: 'meetup', label: 'Meetups', icon: '🐕' },
        { value: 'competition', label: 'Competition', icon: '🏆' }
    ]

    return (
        <div className="container">
            <div className="page-header">
                <h1>Pet Events</h1>
                <p>Discover training camps, adoption drives, meetups, and competitions near you</p>
            </div>

            <div className={styles.filters}>
                {eventTypes.map((type) => (
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
            ) : events.length > 0 ? (
                <div className="grid grid-3" style={{ paddingBottom: '60px' }}>
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📅</div>
                    <h3>No events found</h3>
                    <p>Check back later for new events or try a different filter</p>
                </div>
            )}
        </div>
    )
}
