
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useForceUpdate from './useForceUpdate';

export default function useApi( apiFunction, formatDataToResult, autoFetch=true ){

    const router = useRouter();

    const fetching = useRef(null);
    const forceUpdate = useForceUpdate();
    const [ response, setResponse ] = useState({});
    const [ result, setResult ] = useState({});

    const fetchData = async () => {
        if( fetching.current ) return; // Already fetching
        fetching.current = true;
        forceUpdate();

        const res = await apiFunction();
        setResponse( res );
        if( res.success ){
            setResult( formatDataToResult
                ? formatDataToResult( res )
                : res.data
            );
        }

        fetching.current = false;
    }

    if( autoFetch ){
        useEffect(() => {
            fetchData();
        }, [ router.asPath ]) // only run at inital render
    }

    const data = {
        fetching: fetching.current == null ? !!autoFetch : fetching.current,
        success: ( response.success !== null ) ? response.success : null,
        status: response.status || null,

        raw: response.data || null,
        result: result,
    }

    return [ data, fetchData ];
}