
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useApi from '@/hooks/useApi';
import useTabs from '@/hooks/useTabs';

// Utils
import * as api from '@/services/api';

// Built-in Components
import Head from 'next/head';

// Lib Components
import Slider from 'react-slick';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import Content from '@/components/Content';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Ticket from '@/components/Ticket';

// Styles
import styles from '@/styles/pages/Tickets.module.scss';
import { paddSmall } from '@/styles/exports.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function TicketsPage(){

    const router = useRouter();

    // - Data Fetching

    const { queueID } = router.query;
    
    const [ data, fetchData ] = useApi( () => api.getTickets(), null, true ); // initial fetch

    // - Tabs
    const [ TicketsTab, setTicketsTab, TicketsNavigator ] = useTabs([
        // { name: 'Park Passes', component: '' },
        // { name: 'Ride Tickets', component: '' }
        { name: 'Tickets', component: '' },
    ]);

    // - Carousel

    // ~ doesn't work with useRef
    const [ carousel, setCarousel ] = useState(null);

    const slickSettings = {
        className: styles.carousel,
        infinite: false,
        centerMode: true,
        centerPadding: parseInt( paddSmall ),
        speed: 300
    }

    // - Scroll to url query ticket

    useEffect(() => {
        if( router.isReady && data.fetched && carousel!=null ){
            const ticketID = router.query.t;

            const ticketIndex = data.result.findIndex( ticket => ticket.id == ticketID );
            if( ticketIndex == -1 ) return;

            try{ carousel.slickGoTo( ticketIndex, true ); } // true: no animation
            catch( error ){} // ignore error - problem with react-slick
        }
    }, [ router.asPath, router.isReady, data, carousel ]) // only run at inital render

    // - Render

    return (
        <>
            <Head>
                <title>Scan</title>
            </Head>
            
            <LayoutWrapper>            
                <Header hideBack hideSearch coloredIcons>
                    <TicketsNavigator/>
                </Header>
            </LayoutWrapper>


            <Content data={data} noContentMessage="You have no Tickets">
                { content =>
                <Slider ref={slider => setCarousel(slider)} {...slickSettings}>
                    { content.map(( item, index ) => <Ticket key={item.id} {...item}/> )}
                </Slider>
                }
            </Content>

            <NavBar/>
        </>
    )
}
