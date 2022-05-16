import { Link } from 'react-router-dom'
import styles from './Tab.module.css'

export default function Tab({ children, link, id }) {
    const classes = [id === 0 ? styles.first : '', styles.text].join(' ')

    return (
        <Link to={link} className={classes}>
            {children}
        </Link>
    )
}
