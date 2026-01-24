import Link from 'next/link'
import styles from './ServiceCard.module.css'

export default function ServiceCard({ provider }) {
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

    const minPrice = provider.services && provider.services.length > 0
        ? Math.min(...provider.services.map(s => s.price))
        : 0

    return (
        <Link href={`/services/${provider._id}`} className={styles.card}>
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
                {provider.discountPercent > 0 && (
                    <span className={styles.discountBadge}>
                        {provider.discountPercent}% OFF
                    </span>
                )}
            </div>

            <div className={styles.content}>
                <span className={styles.type}>{provider.type}</span>
                <h3 className={styles.name}>{provider.name}</h3>

                <div className={styles.rating}>
                    <div className={styles.stars}>{renderStars(provider.rating)}</div>
                    <span className={styles.ratingValue}>{provider.rating?.toFixed(1) || '0.0'}</span>
                </div>

                <p className={styles.description}>{provider.description}</p>

                <div className={styles.location}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {provider.address}
                </div>

                <div className={styles.footer}>
                    <div className={styles.services}>
                        {provider.services?.length || 0} services available
                    </div>
                    <div className={styles.price}>
                        From <span>₹{minPrice}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
