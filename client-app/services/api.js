
import axios from 'axios';

// # UTILS

const hostname = ( process.env.NEXT_PUBLIC_API_DOMAIN ) ? process.env.NEXT_PUBLIC_API_DOMAIN : 'http://localhost:4000';

const api = route => `${hostname}/${process.env.NEXT_PUBLIC_API_VERSION}${route}`;

const loginRoute = '/login';
async function redirectLogin(){
    const currentPath = window.location.pathname;
    if( currentPath == loginRoute ) return;
    window.location = `${loginRoute}?redirect=${currentPath}`;

    await new Promise(()=>{}); // Halt to stay 'loading'
}

const lastFetch = {};

async function fetchApi( route, method='GET', data ){

    // Prevent duplicate requests (to prevent spamming the API & prevent incorrect refresh token reuse detection because of auto refresh)
    if( lastFetch[route] ){
        const timeSinceLastFetch = Date.now() - lastFetch[route];
        if( timeSinceLastFetch < 1000 ){
            console.log(`Duplicate API request rejected: ${route}`);
            return { success: false, error: 'Duplicate request' }
        }
    }
    lastFetch[route] = Date.now();

    let options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        method,
        credentials: 'include'
    }
    if( method == 'POST' ){ options.body = JSON.stringify(data); }

    let response;
    try { response = await fetch( api(route), options );
    } catch (error) {
        console.log(error);
        return { success: false, error: 'Network error' };
    }

    if( response.status == 401 ) await redirectLogin();

    const result = await response.json();
    result.status = response.status;
    if( process.env.NODE_ENV !== 'production' ) console.log(result);
    return result;
}

// # ENDPOINTS

// - Auth

export async function login( email, password ){
    return await fetchApi( '/auth/login', 'POST', { email, password } );
}

export async function register( email, password ){
    return await fetchApi( '/auth/register/user', 'POST', { email, password } );
}

// - Queues

export async function getQueues(){
    return await fetchApi( '/queues/get' );
}

export async function getQueue( id ){
    return await fetchApi( `/queues/get/queue/${id}` );
}

export async function getGroup( id ){
    return await fetchApi( `/queues/get/group/${id}` );
}