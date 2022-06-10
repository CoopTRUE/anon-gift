import React, { useMemo } from 'react'
import styles from './Header.module.css'

import Tab from './Tab'

export default function Header() {
    const tabs = useMemo(
        () => [
            ['about', '/#about'],
            ['trade', '/trade'],
            // ['help', '/help'],
        ],
        []
    )

    return (
        <header className={styles.container}>
            <div className={styles.tabs}>
                {tabs.map(([children, link], i) => (
                    <Tab key={i} id={i} {...{ link }}>
                        {children}
                    </Tab>
                ))}
            </div>
        </header>
    )
}
