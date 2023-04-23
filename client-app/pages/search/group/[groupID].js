
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
import Content from '@/components/Content';
import CardListGroups from '@/components/CardListGroups';

import styles from '@/styles/pages/Home.module.scss';

export default function GroupPage(){

    const router = useRouter();
    const { groupID } = router.query;
    
    const [ data, fetchData ] = useApi(

        // Fetch Function
        () => api.getGroup( groupID ),

        // Format Function
        res => {
            return {
                group: res.data,
                cardGroups: formatResultsAsCards( res.data.children )
            }
        },
        
        // No auto Fetch
        false
    );
    
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