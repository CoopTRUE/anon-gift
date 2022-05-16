import { Link } from 'react-router-dom'
import styles from './Button.module.css'

export default function Button({
    children,
    link,
    callback = () => {},
    className,
    type = 'one',
}) {
    const classes = [styles.button, styles[type], className].join(' ')

    if (!link)
        return (
            <a className={classes} onClick={callback}>
                {children}
            </a>
        )

    if (link.startsWith('/'))
        return (
            <Link className={classes} onClick={callback} to={link}>
                {children}
            </Link>
        )

    return (
        <a className={classes} onClick={callback} href={link}>
            {children}
        </a>
    )
}
