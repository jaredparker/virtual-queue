
// Styles
import styles from '@/styles/components/Gap.module.scss';


export default function Gap( props ){

    const classes = props.className ? `${styles.gap} ${props.className}` : styles.gap;

    return (
        <div {...props} className={classes}>
            {props.children}
        </div>
    )
}