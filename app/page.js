'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import ServiceCard from '@/components/ServiceCard'
import SubscriptionBanner from '@/components/SubscriptionBanner'
import styles from './page.module.css'

export default function Home() {
  const { data: session } = useSession()
  const [events, setEvents] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, servicesRes] = await Promise.all([
          fetch('/api/events?limit=4'),
          fetch('/api/services?limit=4')
        ])
        const eventsData = await eventsRes.json()
        const servicesData = await servicesRes.json()
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Everything Your Pet Needs,
            <span className={styles.gradient}> One App</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover events, book services, and connect with the best pet care providers.
            Exclusive discounts for subscribers!
          </p>
          <div className={styles.heroActions}>
            <Link href="/events" className="btn btn-primary btn-lg">
              Explore Events
            </Link>
            <Link href="/services" className="btn btn-secondary btn-lg">
              Find Services
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Events</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>200+</span>
              <span className={styles.statLabel}>Providers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>50K+</span>
              <span className={styles.statLabel}>Pet Parents</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroEmoji}>🐾</div>
        </div>
      </section>

      {(!session || !session.user.isSubscribed) && <SubscriptionBanner />}

      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">Upcoming Events</span>
          </h2>
          <Link href="/events" className="btn btn-secondary">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No events available yet. Check back soon!</p>
          </div>
        )}
      </section>

      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">Top Service Providers</span>
          </h2>
          <Link href="/services" className="btn btn-secondary">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-4">
            {services.map((provider) => (
              <ServiceCard key={provider._id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No service providers available yet. Check back soon!</p>
          </div>
        )}
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2 className="section-title text-center mb-6">
            <span className="text-gradient">Why Choose PetEvents?</span>
          </h2>
          <div className="grid grid-3">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📅</div>
              <h3>Discover Events</h3>
              <p>Training camps, adoption drives, meetups, and competitions all in one place</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Exclusive Discounts</h3>
              <p>Get partner-specific offers and save on every booking as a subscriber</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏆</div>
              <h3>Verified Providers</h3>
              <p>Connect with trusted veterinarians, groomers, and trainers near you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
