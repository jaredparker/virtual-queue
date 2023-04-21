
import styles from '@/styles/components/Button.module.scss';

export default function Button({ children, subButton, onClick }){

    const className = subButton ? styles.subButton : styles.button;

    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    )
}