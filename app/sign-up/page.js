import { SignUp } from '@clerk/nextjs'
import styles from '../register/auth.module.css'

export default function SignUpPage() {
    return (
        <div className={styles.container}>
            <div className={styles.background}></div>
            <div className={styles.content}>
                <div className={styles.authCard}>
                    <div className={styles.header}>
                        <h1>Join Pet Community!</h1>
                        <p>Create your account to access pet events and services</p>
                    </div>
                    
                    <SignUp 
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