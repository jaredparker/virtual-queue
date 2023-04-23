
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useApi from '@/hooks/useApi';

// Utils
import * as api from '@/services/api';
import formatResultsAsCards from '@/utils/formatResultsAsCards';

// Built-in Components
import Head from 'next/head';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import NavBar from "@/components/NavBar";
import Header from '@/components/Header';
import Content from '@/components/Content';
import CardListGroups from '@/components/CardListGroups';


export default function GroupPage(){

    const router = useRouter();
    const { groupID } = router.query;

    const formatResponse = res => {
        return {
            group: res.data,
            cardGroups: formatResultsAsCards( res.data.children )
        }
    }
    
    const [ data, fetchData ] = useApi( () => api.getGroup( groupID ), formatResponse, false ); // No initial fetch
    
    useEffect(() => { if( router.isReady ){ fetchData(); }
    }, [ router.asPath, router.isReady ]) // only run at inital render

    return (
        <>
            <Head>
                <title>{data?.result?.group?.name||'Loading...'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <LayoutWrapper fillHeight={true} bannerImage={data?.result?.group?.bannerImage} header={
                <Header title={data?.result?.group?.name}/>
            }>
                <Content
                    data={data}
                    noContentCheck={ result => result.cardGroups.length === 0 }
                    renderContent={ result => <CardListGroups>{result.cardGroups}</CardListGroups> }
                />
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}