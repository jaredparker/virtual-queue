
import axios from 'axios';

// # UTILS

const hostname = ( process.env.NEXT_PUBLIC_API_DOMAIN ) ? process.env.NEXT_PUBLIC_API_DOMAIN : 'http://localhost:4000';

const api = route => `${hostname}/${process.env.NEXT_PUBLIC_API_VERSION}${route}`;

async function fetchApi( route, method='GET', data ){

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

    const result = await response.json();
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

export async function getGroup( id ){
    return await fetchApi( `/queues/get/group/${id}` );
}