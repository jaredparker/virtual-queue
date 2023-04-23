
// Hooks
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// Utils
import * as api from '@/services/api';

// Built-in Components
import Head from 'next/head';

// Custom Components
import LayoutWrapper from '@/components/LayoutWrapper';
import LayoutGroup from '@/components/LayoutGroup';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import ErrorBox from "@/components/ErrorBox";


export default function LoginPage(){

    const router = useRouter();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [ errorText, setErrorText ] = useState(''); 

    const login = async () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        setErrorText('');
        const result = await api.login( email, password );

        // Login was not successful
        if( result.success == false ){
            return setErrorText( result.message );
        }

        // Handle Login
        const redirect = router.query.redirect || '/tickets';
        router.push( redirect );
    }

    const register = async () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        setErrorText('');
        const result = await api.register( email, password );

        // Register was not successful
        if( result.success == false ){
            return setErrorText( result.message );
        }

        // Handle Register
        const redirect = router.query.redirect || '/tickets';
        router.push( redirect );
    }

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LayoutWrapper fillHeight={true}>

                <LayoutGroup marginSize={'large'}>
                    <h1>Hello</h1>
                    <p>Please login to proceed</p>
                </LayoutGroup>

                <LayoutGroup marginSize={'large'} gapSize={'large'}>
                    <TextInput name="Email" innerRef={emailRef}></TextInput>
                    <TextInput name="Password" innerRef={passwordRef} type={'password'}></TextInput>
                    <ErrorBox>{errorText}</ErrorBox>
                </LayoutGroup>
            </LayoutWrapper>

            <LayoutWrapper>
                <LayoutGroup marginSize={'large'}>
                    <Button onClick={login}>Login</Button>
                    <Button onClick={register} subButton={true}>Register</Button>
                </LayoutGroup>
            </LayoutWrapper>
        </>
    )
}
