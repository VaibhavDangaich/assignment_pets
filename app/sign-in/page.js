import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import styles from './auth.module.css'

export default function SignInPage() {
    return (
        <div className={styles.container}>
            <div className={styles.background}></div>
            <div className={styles.content}>
                <SignIn 
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            rootBox: styles.clerkRoot,
                            card: styles.clerkCard,
                            formButtonPrimary: styles.primaryButton,
                        },
                        variables: {
                            colorPrimary: '#8b5cf6',
                            colorBackground: '#1f2937',
                            colorInputBackground: '#374151',
                            colorInputText: '#ffffff',
                            colorTextOnPrimaryBackground: '#ffffff',
                            borderRadius: '0.75rem',
                        }
                    }}
                />
            </div>
        </div>
    )
}