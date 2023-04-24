
import styles from '@/styles/components/Box.module.scss';

export default function Box( props ){

    const classes = props.className ? `${styles.box} ${props.className}` : styles.box;

    return (
        <div {...props} className={classes}>
            {props.children}
        </div>
    )
}