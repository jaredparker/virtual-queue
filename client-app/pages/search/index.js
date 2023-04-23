
// Hooks
import useApi from '@/hooks/useApi';

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


export default function SearchPage(){

    const [ data, fetchData ] = useApi( api.getQueues, res => formatResultsAsCards( res.data ) ); // Auto Fetch

    return (
        <>
            <Head>
                <title>Search</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <LayoutWrapper fillHeight={true} fetching={data.fetching}>
                <Content
                    data={data}
                    noContentCheck={ result => result.length === 0 }
                    renderContent={ result => <CardListGroups>{result}</CardListGroups> }
                />
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}