

import LayoutGroup from './LayoutGroup';

import styles from '@/styles/components/Spinner.module.scss';

export default function Spinner({ small=false }){

    const classes = `${styles.spinner} ${small ? styles.small : ''}`;

    return (
        <div className={classes}/>
    )
}