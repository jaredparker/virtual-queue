
import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import LayoutWrapper from '@/components/LayoutWrapper';
import LayoutGroup from '@/components/LayoutGroup';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';

import styles from '@/styles/pages/Home.module.scss';

import * as api from '@/services/api';
import ErrorBox from "@/components/ErrorBox";
import NavBar from "@/components/NavBar";
import CardList from "@/components/CardList";
import formatResultsAsCards from '@/utils/formatResultsAsCards';
import Header from '@/components/Header';

export default function QueuePage(){

    const router = useRouter();
    const { queueID } = router.query;

    const [ queue, setQueue ] = useState({});

    const getQueueData = async () => {
    }
    
    useEffect(() => {
        if( router.isReady ){
        }
    }, [ router.asPath, router.isReady ]) // only run at inital render

    return (
        <>
            <Head>
                <title>{queue.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <LayoutWrapper fillHeight={true} bannerImage={queue.bannerImage} header={
                <Header title={queue.name}/>
            }>
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}
