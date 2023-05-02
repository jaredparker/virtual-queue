
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
import Content from '@/components/Content';
import CardListGroups from '@/components/CardListGroups';
import Header from '@/components/Header';
import TextInput from '@/components/TextInput';


export default function QueryPage(){

    const router = useRouter();
    
    const [ data, fetchData ] = useApi( q => api.searchQueuesQuery(q), res => formatResultsAsCards( res.data.results ), false ); // No auto Fetch
    const [ query, setQuery ] = useState('');

    const normalise = q => q.trim().toLowerCase();
    const isEmpty = q => normalise(q) === '';

    const searchDelay = useRef( null );
    const onChange = e => {
        const q = e.target.value;

        console.log( q, isEmpty(q) );

        clearTimeout( searchDelay.current );
        searchDelay.current = setTimeout( () => {

            setQuery( q );
            if( isEmpty( q ) ) return;

            // Update url
            router.push({
                query: { ...router.query, q: normalise(q) }
            }, undefined, { shallow: true } );

            fetchData( true, normalise(q) );

        }, isEmpty(q) ? 0 : 300 );
    }

    const [ goingBack, setGoingBack ] = useState( false );
    const onBlur = e => {
        const q = e.target.value;
        if( !isEmpty( q ) ) return;

        setGoingBack( true ); // ~ to prevent going back twice (back for blur, back for button press) (hacky fix)
        router.back();
    }

    useEffect(() => {
        if( router.isReady ){
            if( router.query.q ){
                console.log( router.query.q );
                setQuery( router.query.q );
                fetchData( true, router.query.q );
            }
        }
    }, [ router.asPath, router.isReady ]) // only run at inital render

    return (
        <>
            <Head>
                <title>Search</title>
            </Head>
            
            <LayoutWrapper fillHeight={true}>
                
                <Header hideBack={goingBack} hideSearch coloredIcons>
                    <TextInput type={'search'} autoFocus onChange={onChange} onBlur={onBlur} defaultValue={query}>
                        Search
                    </TextInput>
                </Header>

                { !isEmpty( query ) &&
                    <Content data={data} noInitalFetch>{
                        result => <>
                            <CardListGroups>{result}</CardListGroups> 
                        </>
                    }</Content>
                }

            </LayoutWrapper>

            <NavBar/>
        </>
    )
}
