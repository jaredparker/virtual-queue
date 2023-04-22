
import React, { useEffect, useRef, useState } from "react";

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

export default function ScanPage(){

    return (
        <>
            <Head>
                <title>Scan</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <LayoutWrapper fillHeight={true}>

            </LayoutWrapper>

            <NavBar/>
        </>
    )
}
