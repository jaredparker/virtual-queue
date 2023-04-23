
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

export default function QueryPage(){

    const router = useRouter();

    useEffect(() => {
        if( router.isReady ){
        }
    }, [ router.asPath, router.isReady ]) // only run at inital render

    return (
        <>
            <Head>
                <title>{queue.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <LayoutWrapper fillHeight={true}>
                
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}
