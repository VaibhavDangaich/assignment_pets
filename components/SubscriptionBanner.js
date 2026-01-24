import Link from 'next/link'
import styles from './SubscriptionBanner.module.css'

export default function SubscriptionBanner() {
    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <div className={styles.icon}>👑</div>
                <div className={styles.text}>
                    <h3>Unlock Premium Features</h3>
                    <p>Subscribe to book events, services & get exclusive discounts!</p>
                </div>
                <Link href="/subscription" className={styles.button}>
                    Subscribe Now
                </Link>
            </div>
            <div className={styles.decoration}></div>
        </div>
    )
}
