
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useApi from '@/hooks/useApi';

// Utils
import * as api from '@/services/api';

// Built-in Components
import Head from 'next/head';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import NavBar from "@/components/NavBar";
import Header from '@/components/Header';
import Content from '@/components/Content';


export default function QueuePage(){
    
    const router = useRouter();
    const { queueID } = router.query;
    
    const [ data, fetchData ] = useApi( () => api.getQueue( queueID ), null, false ); // No initial fetch
    
    useEffect(() => { if( router.isReady ){ fetchData(); }
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
