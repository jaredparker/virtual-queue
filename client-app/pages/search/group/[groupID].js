
import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import LayoutWrapper from '@/components/LayoutWrapper';
import LayoutGroup from '@/components/LayoutGroup';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';

import styles from '@/styles/pages/Home.module.scss';

import * as api from '@/services/api';
import ErrorBox from "@/components/ErrorBox";
import NavBar from "@/components/NavBar";
import CardList from "@/components/CardList";
import Header from '@/components/Header';

import formatResultsAsCards from '@/utils/formatResultsAsCards';
import renderCardGroups from '@/utils/renderCardGroups';

export default function GroupPage(){

    const router = useRouter();
    const { groupID } = router.query;

    const [ group, setGroup ] = useState({});
    const [ cardGroups, setCardGroups ] = useState([]);

    const getGroupData = async () => {
        console.log( groupID );

        const res = await api.getGroup( groupID );
        if( res.success ){
            setGroup( res.data );
            setCardGroups( formatResultsAsCards( res.data.children ) )
        }
    }
    
    useEffect(() => {
        if( router.isReady ){
            getGroupData();
        }
    }, [ router.asPath, router.isReady ]) // only run at inital render

    return (
        <>
            <Head>
                <title>{group.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <LayoutWrapper fillHeight={true} bannerImage={group.bannerImage} header={
                <Header title={group.name}/>
            }>
                <LayoutGroup gapSize='medium'>
                    { renderCardGroups( cardGroups ) }
                </LayoutGroup>
            </LayoutWrapper>

            <NavBar/>
        </>
    )
}
