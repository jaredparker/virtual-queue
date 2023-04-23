
import styles from '@/styles/components/ErrorBox.module.scss';
import LayoutGroup from './LayoutGroup';

export default function ErrorBox({ children="", centreContent=false, className='' }){

    const messages = children.length ? children.split('\n') : [];

    const classes = `${styles.error} ${className} ${centreContent && styles.centre}`;

    return (
        messages.length ?
        <div className={classes}>
            { messages.map( (message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
        : <></>
    );
}