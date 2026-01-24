import { SignIn } from '@clerk/nextjs'
import styles from '../login/auth.module.css'

export default function SignInPage() {
    return (
        <div className={styles.container}>
            <div className={styles.background}></div>
            <div className={styles.content}>
                <div className={styles.authCard}>
                    <div className={styles.header}>
                        <h1>Welcome Back!</h1>
                        <p>Sign in to access your pet services account</p>
                    </div>
                    
                    <SignIn 
                        appearance={{
                            elements: {
                                rootBox: styles.clerkRoot,
                                card: styles.clerkCard,
                                headerTitle: { display: 'none' },
                                headerSubtitle: { display: 'none' }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}