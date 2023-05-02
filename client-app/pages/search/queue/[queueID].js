
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useApi from '@/hooks/useApi';
import useTabs from '@/hooks/useTabs';

// Utils
import * as api from '@/services/api';

// Built-in Components
import Head from 'next/head';
import { HiOutlineChevronDoubleRight, HiOutlineArrowSmallUp, HiOutlineArrowSmallDown } from 'react-icons/hi2';

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

const ticketsRedirect = `/tickets`;

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

function QueueNow({ content: queue }){
    const { waitTimes } = queue;
    const router = useRouter();

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

    // Join Queue
    const joinQueue = async () => {
        const res = await api.joinQueue( queue.id );
        if( res.success ){
            router.push( `${ticketsRedirect}?t=${res.data.id}` );
            await new Promise(() => {}); // Keep button loading until redirect   
        }
    }

    return (
        <>
            <LayoutGroup centreContent={true} gap={'medium'}>
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
                <Button onClick={joinQueue}>Join Queue</Button>
            </LayoutGroup>
        </>
    );
}

function QueueAdvance({ content: queue }){
    const { timeslots } = queue;
    const router = useRouter();

    const [ selectedSlot, setSelectedSlot ] = useState( timeslots[0]?.id );
    const [ overflowHidden, setOverflowHidden ] = useState( true );

    const overflowLimit = 4;

    const formatTime = ( unix ) => new Date( unix * 1000 ).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

    let selectedInOverflow = true;
    const $timeslots = timeslots.map(( { id, startTime, duration }, index ) => {
        const inOverflow = index >= overflowLimit;
        const selected = selectedSlot === id;
        if( selected && !inOverflow ) selectedInOverflow = false;

        if( overflowHidden ){
            if( inOverflow && !selected ) return; // hide overflow slots
            if( index+1 == overflowLimit && selectedInOverflow ) return; // hide last slot if selected slot is in overflow
        }

        const startStr = formatTime( startTime );
        const endStr = formatTime( startTime + duration );

        const selectSlot = () => setSelectedSlot( id );

        const classes = `${styles.timeSlot} ${selected ? styles.selected : ''}`;

        return <li key={id} className={classes} onClick={selectSlot}>{startStr} - {endStr}</li>
    });

    // Book Ticket Button
    const bookTicket = async () => {
        if( !selectedSlot ) return;

        const res = await api.bookTicket( queue.id, selectedSlot );
        if( res.success ){
            router.push( `${ticketsRedirect}?t=${res.data.id}` );
            await new Promise(() => {}); // Keep button loading until redirect   
        }
    }

    return (
        <>
        <LayoutGroup centreContent={true}>
            <h3>Entry Time</h3>
            <ul className={styles.timeSlots}>
                { $timeslots }
            </ul>
            { timeslots.length > overflowLimit &&
                <div className={styles.overflow} onClick={() => setOverflowHidden(!overflowHidden)}>
                    { overflowHidden
                    ? <><p>show more</p><HiOutlineArrowSmallDown/></>
                    : <><p>show less</p><HiOutlineArrowSmallUp/></>
                    }
                </div>
            }
            { timeslots.length == 0 && <p className={styles.noSlots}>no times available</p> }
        </LayoutGroup>
        <Gap/>
        <LayoutGroup>
            <Button onClick={bookTicket}>Book Ticket</Button>
        </LayoutGroup>
        </>
    );
}