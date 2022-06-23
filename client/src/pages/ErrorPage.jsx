import styles from './ErrorPage.module.css'

export default () => {
    return (
        <div className={styles.body}>
            <div className={styles.rail}>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
                <div className={`${styles.stamp} ${styles.four}`}>4</div>
                <div className={`${styles.stamp} ${styles.zero}`}>0</div>
            </div>
            <div className={styles.world}>
                <div className={styles.forward}>
                    <div className={styles.box}>
                        <div className={styles.wall}></div>
                        <div className={styles.wall}></div>
                        <div className={styles.wall}></div>
                        <div className={styles.wall}></div>
                        <div className={styles.wall}></div>
                        <div className={styles.wall}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}