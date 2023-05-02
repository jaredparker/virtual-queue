
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from '@/styles/pages/Home.module.scss';

export default function Home(){

    const router = useRouter();

    useEffect(() => {
        if( router.isReady ){
            router.push('/search');
        }

    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>Virtual Queuing</title>
            </Head>
            <main>
            </main>
        </>
    )
}
