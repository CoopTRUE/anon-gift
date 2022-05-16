import styles from './Heading.module.css'

export default function Heading({ children, className }) {
    const classes = [styles.text, className].join(' ')

    return <h1 className={classes}>{children}</h1>
}
