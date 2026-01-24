'use client'

import { useUser, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
    const { user, isLoaded } = useUser()
    const pathname = usePathname()

    const isActive = (path) => pathname === path

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🐾</span>
                    <span className={styles.logoText}>PetEvents</span>
                </Link>

                <div className={styles.navLinks}>
                    <Link
                        href="/events"
                        className={`${styles.navLink} ${isActive('/events') ? styles.active : ''}`}
                    >
                        Events
                    </Link>
                    <Link
                        href="/services"
                        className={`${styles.navLink} ${isActive('/services') ? styles.active : ''}`}
                    >
                        Services
                    </Link>
                    {user && (
                        <Link
                            href="/bookings"
                            className={`${styles.navLink} ${isActive('/bookings') ? styles.active : ''}`}
                        >
                            My Bookings
                        </Link>
                    )}
                </div>

                <div className={styles.navActions}>
                    {!isLoaded ? (
                        <div className={styles.loadingPlaceholder}></div>
                    ) : user ? (
                        <>
                            <Link href="/subscription" className={styles.subscribeBtn}>
                                Subscribe
                            </Link>
                            <span className={styles.userName}>
                                {user.firstName || user.emailAddresses[0]?.emailAddress.split('@')[0]}
                            </span>
                            <SignOutButton>
                                <button className={styles.logoutBtn}>
                                    Logout
                                </button>
                            </SignOutButton>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className={styles.loginBtn}>
                                Login
                            </Link>
                            <Link href="/sign-up" className={styles.registerBtn}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
