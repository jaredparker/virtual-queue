
import Head from 'next/head';
import Image from 'next/image';

import styles from '@/styles/pages/Home.module.scss';

export default function Home(){
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main>
        <h1 className={styles.title}>Hallo</h1>
      </main>
    </>
  )
}
