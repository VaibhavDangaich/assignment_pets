'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './subscription.module.css'

export default function SubscriptionPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [subscription, setSubscription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subscribing, setSubscribing] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly',
            price: 9.99,
            period: '/month',
            features: [
                'Unlimited event bookings',
                'Book any service provider',
                'Access all partner discounts',
                'Priority customer support',
                'Cancel anytime'
            ]
        },
        {
            id: 'yearly',
            name: 'Yearly',
            price: 99.99,
            period: '/year',
            savings: 'Save ₹20!',
            popular: true,
            features: [
                'All monthly features',
                '2 months free',
                'Early access to new events',
                'Exclusive yearly member perks',
                'Priority booking for popular events'
            ]
        }
    ]

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        async function fetchSubscription() {
            try {
                const res = await fetch('/api/subscriptions')
                const data = await res.json()
                setSubscription(data.subscription)
            } catch (error) {
                console.error('Error fetching subscription:', error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchSubscription()
        }
    }, [session, status, router])

    const handleSubscribe = async (planId) => {
        if (!session) {
            router.push('/login')
            return
        }

        setSelectedPlan(planId)
        setSubscribing(true)

        try {
            const res = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Subscription failed')
            }

            setSubscription(data.subscription)
            await update({ isSubscribed: true })
            router.refresh()
        } catch (error) {
            console.error('Subscription error:', error)
        } finally {
            setSubscribing(false)
            setSelectedPlan(null)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (status === 'loading' || loading) {
        return (
            <div className="loading-container" style={{ minHeight: '50vh' }}>
                <div className="spinner"></div>
            </div>
        )
    }

    if (subscription && subscription.isActive) {
        return (
            <div className="container">
                <div className={styles.activeSubscription}>
                    <div className={styles.successIcon}>✓</div>
                    <h1>You're a PRO Member!</h1>
                    <p>Enjoy unlimited access to all events and services with exclusive discounts</p>

                    <div className={styles.subscriptionDetails}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Plan</span>
                            <span className={styles.value}>{subscription.plan}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Started</span>
                            <span className={styles.value}>{formatDate(subscription.startDate)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Renews</span>
                            <span className={styles.value}>{formatDate(subscription.endDate)}</span>
                        </div>
                    </div>

                    <div className={styles.benefits}>
                        <h3>Your Benefits</h3>
                        <ul>
                            <li>✓ Unlimited event bookings</li>
                            <li>✓ All service providers available</li>
                            <li>✓ Partner discounts applied automatically</li>
                            <li>✓ Priority support</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Choose Your Plan</h1>
                <p>Unlock unlimited bookings and exclusive discounts for your pets</p>
            </div>

            <div className={styles.plansGrid}>
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
                    >
                        {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}

                        <div className={styles.planHeader}>
                            <h2>{plan.name}</h2>
                            {plan.savings && <span className={styles.savings}>{plan.savings}</span>}
                        </div>

                        <div className={styles.priceSection}>
                            <span className={styles.currency}>₹</span>
                            <span className={styles.price}>{plan.price}</span>
                            <span className={styles.period}>{plan.period}</span>
                        </div>

                        <ul className={styles.features}>
                            {plan.features.map((feature, index) => (
                                <li key={index}>
                                    <span className={styles.checkIcon}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block btn-lg`}
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={subscribing}
                        >
                            {subscribing && selectedPlan === plan.id
                                ? 'Processing...'
                                : `Subscribe ${plan.name}`}
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.guarantee}>
                <span>🛡️</span>
                <p>30-day money-back guarantee. Cancel anytime with no questions asked.</p>
            </div>
        </div>
    )
}
