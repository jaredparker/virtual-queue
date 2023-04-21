
import axios from 'axios';

// # UTILS

const api = (process.env.NODE_ENV == 'production')
    ? route => `${process.env.API_DOMAIN}/${process.env.NEXT_PUBLIC_API_VERSION}${route}`
    : route => `http://localhost:4000/${process.env.NEXT_PUBLIC_API_VERSION}${route}`;

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

    const res = await fetch( api(route), options );

    const result = await res.json();
    console.log(result);
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