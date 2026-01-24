import Link from 'next/link'
import styles from './EventCard.module.css'

export default function EventCard({ event }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
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

    const discountedPrice = event.discountPercent > 0
        ? event.price * (1 - event.discountPercent / 100)
        : event.price

    const slotsLeft = event.totalSlots - event.bookedSlots

    return (
        <Link href={`/events/${event._id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <div
                    className={styles.image}
                    style={{
                        backgroundImage: event.image
                            ? `url(${event.image})`
                            : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                    }}
                >
                    <span className={styles.typeIcon}>{getTypeIcon(event.type)}</span>
                </div>
                {event.discountPercent > 0 && (
                    <span className={styles.discountBadge}>
                        {event.discountPercent}% OFF
                    </span>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <span className={styles.type}>{event.type}</span>
                    <span className={styles.date}>{formatDate(event.date)}</span>
                </div>

                <h3 className={styles.title}>{event.title}</h3>

                <p className={styles.provider}>by {event.providerName}</p>

                <div className={styles.location}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {event.location}
                </div>

                <div className={styles.footer}>
                    <div className={styles.price}>
                        {event.discountPercent > 0 && (
                            <span className={styles.originalPrice}>₹{event.price}</span>
                        )}
                        <span className={styles.currentPrice}>₹{discountedPrice.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.slots} ${slotsLeft < 5 ? styles.slotsLow : ''}`}>
                        {slotsLeft} slots left
                    </div>
                </div>
            </div>
        </Link>
    )
}
