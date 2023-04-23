
import React, { useEffect, useRef, useState } from 'react';
import useApi from '@/hooks/useApi';

import * as api from '@/services/api';
import formatResultsAsCards from '@/utils/formatResultsAsCards';
import renderCardGroups from '@/utils/renderCardGroups';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import LayoutWrapper from '@/components/LayoutWrapper';
import LayoutGroup from '@/components/LayoutGroup';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import ErrorBox from "@/components/ErrorBox";
import NavBar from "@/components/NavBar";
import CardList from "@/components/CardList";
import Header from '@/components/Header';

import styles from '@/styles/pages/Home.module.scss';
import Content from '@/components/Content';

export default function QueuePage(){
    
    const router = useRouter();
    const { queueID } = router.query;
    
    const [ data, fetchData ] = useApi( () => { console.log('get queue', queueID); return api.getQueue( queueID ); }, null, false ); // No initial fetch
    
    useEffect(() => { if( router.isReady ){ console.log('queue', queueID); fetchData(); }
    }, [ router.asPath, router.isReady ]) // only run at inital render


    return (
        <>
            <Head>
                <title>{data?.result?.name||'Loading...'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <LayoutWrapper fillHeight={true} bannerImage={data?.result?.bannerImage} header={
                <Header title={data?.result?.name} subtitle={data?.result?.parentGroup?.name}/>
            }>
                <Content
                    data={data}
                />
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}
