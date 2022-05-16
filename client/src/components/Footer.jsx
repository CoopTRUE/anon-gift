import React, { useMemo } from 'react'
import styles from './Footer.module.css'

export default function Footer() {
    const year = useMemo(() => {
        const date = new Date()
        return date.getFullYear()
    }, [])

    return (
        <footer className={styles.container}>
            <div className={styles.innerContainer}>
                <p className={styles.text}>© Anon Gift {year}</p>
            </div>
        </footer>
    )
}
