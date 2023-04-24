
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// Utils
import * as api from '@/services/api';

// Built-in Components
import Head from 'next/head';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import NavBar from '@/components/NavBar';


export default function TicketsPage(){

    return (
        <>
            <Head>
                <title>Scan</title>
            </Head>
            
            <LayoutWrapper fillHeight={true}>

            </LayoutWrapper>

            <NavBar/>
        </>
    )
}
