
import { useRouter } from 'next/router';

import { HiOutlineArrowSmallLeft, HiMagnifyingGlass } from 'react-icons/hi2';
import * as Icons from '@/components/Icons';

import styles from '@/styles/components/Header.module.scss';

export default function Header({ title, subtitle, hideBack, hideSearch, coloredIcons, children }){
    const router = useRouter();

    const classes = `${styles.header} ${coloredIcons ? styles.coloredIcons : ''}`;

    return (
        <div className={classes}>
            { !hideBack && <Icons.Back/> }
            <div className={styles.headerText}>
                <p className={styles.title}>{title}</p>
                { subtitle &&
                    <p className={styles.subtitle}>{subtitle}</p>
                }
                { children }
            </div>
            { !hideSearch && <Icons.Search/> }
        </div>
    );
}