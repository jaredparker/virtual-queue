
import { useRouter } from 'next/router';

import { HiOutlineArrowSmallLeft, HiMagnifyingGlass } from 'react-icons/hi2';

import styles from '@/styles/components/Header.module.scss';
import LayoutGroup from './LayoutGroup';

export default function Header({ title, subtitle }){
    const router = useRouter();

    return (
        <div className={styles.header}>
            <button className={styles.button} onClick={ () => router.back() }>
                <HiOutlineArrowSmallLeft/>
            </button>
            <div className={styles.headerText}>
                <p className={styles.title}>{title}</p>
                { subtitle &&
                    <p className={styles.subtitle}>{subtitle}</p>
                }
            </div>
            <button className={styles.button}>
                <HiMagnifyingGlass/>
            </button>
        </div>
    );
}