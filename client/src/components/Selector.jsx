import React, { useMemo } from 'react'
import styles from './Selector.module.css'

import Text from './Text'

export default function Selector({
    options = [],
    children,
    callback = () => {},
}) {
    const editedOptions = useMemo(() => ['None', ...options], [options])

    return (
        <div className={styles.container}>
            <Text className={styles.label}>{children}</Text>
            <select className={styles.select} onChange={callback}>
                {editedOptions.map((op, i) => {
                    return (
                        <option key={i} className={styles.option}>
                            {op}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}
