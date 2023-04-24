
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useApi from '@/hooks/useApi';
import useTabs from '@/hooks/useTabs';

// Utils
import * as api from '@/services/api';

// Built-in Components
import Head from 'next/head';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import NavBar from "@/components/NavBar";
import Header from '@/components/Header';
import Content from '@/components/Content';
import LayoutGroup from '@/components/LayoutGroup';


const tabs = [
    {
        name: 'Queue Now',
        component: queueNow
    },
    {
        name: 'Queue Advance',
        component: queueAdvance
    }
];

// const QueueTabs = CreateTabs([
//     { name: 'Queue Now', component: queueNow },
//     { name: 'Queue Advance', component: queueAdvance }
// ]);

// console.log(QueueTabs);


export default function QueuePage(){

    // - Data Fetching
    
    const router = useRouter();
    const { queueID } = router.query;
    
    const [ data, fetchData ] = useApi( () => api.getQueue( queueID ), null, false ); // No initial fetch
    
    useEffect(() => { if( router.isReady ){ fetchData(); }
    }, [ router.asPath, router.isReady ]) // only run at inital render

    // - Tabs
    const [ QueueTab, setQueueTab, QueueNavigator ] = useTabs([
        { name: 'Queue Now', component: queueNow },
        { name: 'Advance', component: queueAdvance }
    ]);

    // - Render

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
                    renderContent={ content => {
                        return (
                            <LayoutGroup centreContent={true} gapSize='medium' marginSize='small'>
                                <LayoutGroup centreContent={true}>
                                    <h3>Ticket Type</h3>
                                    <section>
                                        <QueueNavigator/>
                                    </section>
                                </LayoutGroup>
                                <QueueTab content={content}/>
                            </LayoutGroup>
                        );
                    }}
                />
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}

function queueNow({ content }){
    return (
        <>
            <h3>Queue Now Tab</h3>
            { content.name }
        </>
    );
}

function queueAdvance({ content }){
    return (
        <>
            <h3>Queue Advance Tab</h3>
        </>
    );
}