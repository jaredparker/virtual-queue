
import Head from 'next/head';

import { Raleway } from 'next/font/google';

import '@/styles/globals.scss';

const raleway = Raleway({ subsets: ['latin'] });

export default function App({ Component, pageProps }){
    return (
        <main className={raleway.className}>
            <Head>
                <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height"/>
            </Head>
            <Component {...pageProps} />
        </main>
    );
}
