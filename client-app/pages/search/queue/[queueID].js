
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useApi from '@/hooks/useApi';
import useTabs from '@/hooks/useTabs';

// Utils
import * as api from '@/services/api';

// Built-in Components
import Head from 'next/head';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import NavBar from "@/components/NavBar";
import Header from '@/components/Header';
import Content from '@/components/Content';
import LayoutGroup from '@/components/LayoutGroup';
import Box from '@/components/Box';

// Styles
import styles from '@/styles/pages/Queue.module.scss';
import Button from '@/components/Button';
import Gap from '@/components/Gap';

export default function QueuePage(){

    // - Data Fetching
    
    const router = useRouter();
    const { queueID } = router.query;
    
    const [ data, fetchData ] = useApi( () => api.getQueue( queueID ), null, false ); // No initial fetch
    
    useEffect(() => { if( router.isReady ){ fetchData(); }
    }, [ router.asPath, router.isReady ]) // only run at inital render

    // - Tabs
    const [ QueueTab, setQueueTab, QueueNavigator ] = useTabs([
        { name: 'Queue Now', component: QueueNow },
        { name: 'Advance', component: QueueAdvance }
    ]);

    // - Render

    return (
        <>
            <Head>
                <title>{data?.result?.name||'Loading...'}</title>
            </Head>
            
            <LayoutWrapper fillHeight={true} bannerImage={data?.result?.bannerImage} header={
                <Header title={data?.result?.name} subtitle={data?.result?.parentGroup?.name}/>
            }>
                <Content data={data}>{
                    content => {
                        return (
                            <>
                                <LayoutGroup centreContent={true}>
                                    <h3>Ticket Type</h3>
                                    <Box>
                                        <QueueNavigator/>
                                    </Box>
                                </LayoutGroup>
                                <QueueTab content={content}/>
                            </>
                        );
                    }
                }</Content>
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}

function QueueNow({ content: { waitTimes } }){

    const $waitTimes = [];
    waitTimes.forEach( ( { name, minutes }, index ) => {

        $waitTimes.push(
            <div key={`time-${index}`} className={styles.waitTime}>
                <p>{ name }</p><p>{ minutes } minutes</p>
            </div>
        );

        if( index < waitTimes.length - 1 ) $waitTimes.push(
            <div key={`arrow-${index}`} className={styles.waitTimeArrow}><HiOutlineChevronDoubleRight/></div>
        );
    });

    const totalWaitTime = waitTimes.reduce(( acc, cur ) => acc + cur.minutes, 0 );

    return (
        <>
            <LayoutGroup centreContent={true}>
                <h3>Estimated Queue Time</h3>
                <Box className={styles.waitTimes}>
                    { $waitTimes }
                </Box>
                <Box className={styles.waitTimeTotal}>
                    <p>Total</p><p>{ totalWaitTime } minutes</p>
                </Box>
            </LayoutGroup>
            <Gap/>
            <LayoutGroup>
                <Button>Join Queue</Button>
            </LayoutGroup>
        </>
    );
}

function QueueAdvance({ content }){
    return (
        <>
            <h3>Queue Advance Tab</h3>
        </>
    );
}