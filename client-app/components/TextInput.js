
import LayoutGroup from './LayoutGroup';

import styles from '@/styles/components/TextInput.module.scss';

export default function TextInput({ name, type='text', children, innerRef }){

    return (
        <LayoutGroup>
            <label className={styles.label}>{name}</label>
            <input className={styles.input} type={type} placeholder={children} ref={innerRef}/>
        </LayoutGroup>
    )
}