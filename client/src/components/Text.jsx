import styles from './Text.module.css'

export default function Text({ children, className }) {
    const classes = [styles.text, className].join(' ')

    return <p className={classes}>{children}</p>
}
