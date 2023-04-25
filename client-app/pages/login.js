
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
import Gap from '@/components/Gap';

const fallbackRedirect = '/tickets';

export default function LoginPage(){

    const router = useRouter();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [ errorText, setErrorText ] = useState(''); 

    const checkLogin = async () => {
        const result = await api.authCheck();
        if( result.success == true ) redirect();
    }

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
        await redirect();
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
        await redirect();
    }

    const redirect = () => {
        router.push( router.query.redirect || fallbackRedirect );

        // Keep button loading until redirect
        return new Promise(() => {});
    }

    useEffect(() => {
        checkLogin();
    }, [ router.asPath ]) // only run at inital render

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <LayoutWrapper fillHeight={true}>

                <LayoutGroup marginSize={'large'}>
                    <h1>Hello</h1>
                    <p>Please login to proceed</p>
                </LayoutGroup>

                <LayoutGroup marginSize={'large'} gapSize={'large'}>
                    <TextInput name="Email" innerRef={emailRef}></TextInput>
                    <TextInput name="Password" innerRef={passwordRef} type={'password'} onSubmit={login}></TextInput>
                    <ErrorBox>{errorText}</ErrorBox>
                </LayoutGroup>
                
                <Gap/>

                <LayoutGroup marginSize={'large'}>
                    <Button onClick={login}>Login</Button>
                    <Button onClick={register} subButton={true}>Register</Button>
                </LayoutGroup>
                
            </LayoutWrapper>
        </>
    )
}
