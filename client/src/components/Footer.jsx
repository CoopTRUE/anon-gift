import React, { useMemo } from 'react'
import styles from './Footer.module.css'
import octocatUrl from '../assets/img/octocat.svg'
import rickrollUrl from '../assets/img/rickroll.svg'
export default function Footer() {
    const year = useMemo(() => {
        const date = new Date()
        return date.getFullYear()
    }, [])

    return (
        <footer className={styles.container}>
            <p className={styles.text}>© Anon Gift {year}. Made with ❤️ in SF</p>
            <input className={styles.imageButton} onClick={() => window.location='https://github.com/CoopTRUE/anon-gift'} type='image' src={octocatUrl}/>
            <input className={styles.imageButton} onClick={() => window.location='https://www.youtube.com/watch?v=dQw4w9WgXcQ'} type='image' src={rickrollUrl}/>
        </footer>
    )
}