
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useForceUpdate from './useForceUpdate';

export default function useApi( apiFunction, formatDataToResult, autoFetch=true ){

    const router = useRouter();

    const fetching = useRef(null);
    const abortFetch = useRef(null);
    const forceUpdate = useForceUpdate();
    const [ response, setResponse ] = useState(null);
    const [ result, setResult ] = useState({});

    const fetchData = async ( abortLastFetch, ...args) => {

        // Reject as already fetching or Overwrite Last Fetch
        if( fetching.current ){
            if( abortLastFetch && abortFetch.current ) abortFetch.current();
            else return; // Already fetching
        };

        fetching.current = true;
        forceUpdate();

        // Abort logic
        let aborted = false;
        abortFetch.current = () => {
            aborted = true;
            abortFetch.current = null;
        }

        // Fetch
        try {
            const res = await apiFunction(...args);
            if( aborted ) return;

            setResponse( res );
            if( res.success ){
                setResult( formatDataToResult
                    ? formatDataToResult( res )
                    : res.data
                );
            }

        // API Fetch Error
        } catch (error) {
            if( aborted ) return;

            console.error(error);
            setResponse( { success: false, status: 500, message: 'Internal Server Error' } );
        }

        // Done
        fetching.current = false;
    }

    if( autoFetch ){
        useEffect(() => {
            fetchData();
        }, [ router.asPath ]) // only run at inital render
    }

    const fetched = response !== null;

    const data = fetched
    ? {
        fetching: fetching.current == null ? !!autoFetch : fetching.current,
        fetched,
        success: response.success,
        status: response.status,

        raw: response.data || null,
        result: result,
    }
    : {
        fetching: fetching.current == null ? !!autoFetch : fetching.current,
        fetched, success: null, status: null, raw: null, result: null,
    }

    return [ data, fetchData ];
}