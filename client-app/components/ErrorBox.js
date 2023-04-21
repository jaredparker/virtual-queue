
import styles from '@/styles/components/ErrorBox.module.scss';
import LayoutGroup from './LayoutGroup';

export default function ErrorBox({ children }){

    return children ? (
        <p className={styles.error}>
            {children}
        </p>
    ) : <></>;
}