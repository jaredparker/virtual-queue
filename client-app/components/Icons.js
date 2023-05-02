

import { useRouter } from 'next/router';

import { HiOutlineArrowSmallLeft, HiMagnifyingGlass } from 'react-icons/hi2';

import styles from '@/styles/components/Icons.module.scss';


export function Back({ title, subtitle }){
    const router = useRouter();

    const goBack = () => {
        console.log( router );
        router.back();
    }

    return (
        <button className={styles.button} onClick={goBack}>
            <HiOutlineArrowSmallLeft/>
        </button>
    );
}

export function Search({ path='/search/query' }){
    const router = useRouter();

    return (
        <button className={styles.button} onClick={ () => router.push( path ) }>
            <HiMagnifyingGlass/>
        </button>
    );
}