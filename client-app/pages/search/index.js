
// Hooks
import useApi from '@/hooks/useApi';
import useTabs from '@/hooks/useTabs';

// Utils
import * as api from '@/services/api';
import formatResultsAsCards from '@/utils/formatResultsAsCards';

// Built-in Components
import Head from 'next/head';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import NavBar from "@/components/NavBar";
import Content from '@/components/Content';
import CardListGroups from '@/components/CardListGroups';
import Header from '@/components/Header';
import * as Icons from '@/components/Icons';


export default function SearchPage(){

    const [ data, fetchData ] = useApi( api.searchQueues, res => formatResultsAsCards( res.data.results ) ); // Auto Fetch

    // - Tabs
    const [ QueueTab, setQueueTab, QueueNavigator ] = useTabs([
        { name: 'Park Passes', component: '' },
        { name: 'Ride Tickets', component: '' }
    ]);

    return (
        <>
            <Head>
                <title>Search</title>
            </Head>
            
            <LayoutWrapper fillHeight fetching={data.fetching}>
                <Header hideBack coloredIcons>
                    <QueueNavigator/>
                </Header>
                <Content data={data}>{
                    result => <>
                        <CardListGroups>{result}</CardListGroups> 
                    </>
                }</Content>
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}