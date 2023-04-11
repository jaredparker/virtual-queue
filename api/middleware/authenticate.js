
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import { getDirname } from '../lib/utils.js';
import { user_roles } from '../lib/enums.js';
const __dirname = getDirname( import.meta.url );

function getKey( key ){
    const pathToKey = path.join( __dirname, `../keys/${key}.pem` );
    return fs.readFileSync( pathToKey, 'utf8' );
}

// Private Keys
const jwtRefreshPrivateKey = getKey( 'jwt-refresh-private' );
const jwtAccessPrivateKey = getKey( 'jwt-access-private' );
const jwtIdentityPrivateKey = getKey( 'jwt-identity-private' );

// Public Keys
const jwtRefreshPublicKey = getKey( 'jwt-refresh-public' );
const jwtAccessPublicKey = getKey( 'jwt-access-public' );
const jwtIdentityPublicKey = getKey( 'jwt-identity-public' );

const minutes15 = 15 * 60 * 1000;
const days7 = 10 * 24 * 60 * 60 * 1000;


// # JSON Web Token creation

function createToken( payload, privateKey, expiresIn='15m' ){
    return jwt.sign(
        payload,
        privateKey,
        {
            expiresIn,
            algorithm: 'RS256'
        }
    );
}

// User accounts
function createRefreshToken( payload, expiresIn='7d' ){
    return createToken( payload, jwtRefreshPrivateKey, expiresIn );
}
function createAccessToken( payload, expiresIn='15m' ){
    return createToken( payload, jwtAccessPrivateKey, expiresIn );
}

// Anonymous users
function createIdentityToken( payload ){
    return createToken( payload, jwtIdentityPrivateKey, '1y' );
}

// # JSON Web Token verification

function verifyToken( token, publicKey ){
    return jwt.verify(
        token,
        publicKey,
        { algorithms: ['RS256'] }
    );
}

// # Helpers

function createTokenCookie( name, token, expiresIn, req, res ){
    
    const cookieOptions = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    };

    res.cookie( name, token, cookieOptions );
}

function rotateRefreshToken( refreshToken, expiresIn='7d' ){
    const oldPayload = verifyToken( refreshToken, jwtRefreshPublicKey );
    const newPayload = { id: oldPayload.id, role: oldPayload.role };

    // TODO: Add validation with database for reuse detection

    const newRefreshToken = createRefreshToken( newPayload, expiresIn );
    const newAccessToken  = createAccessToken( newPayload );

    return [ newAccessToken, newRefreshToken ];
}

// # Handlers

export async function login( req, res ){

    // Check login details
    const { username, password } = req.body;
    if( !username || !password ) return res.status(400).json({ 'error': 'Missing username or password' });

    // Check if user exists
    const id = '1234';
    const role = user_roles.STANDARD;

    // Check if password matched

    // Create tokens
    const payload = { id, role };
    const refreshToken = createRefreshToken( payload );
    const accessToken = createAccessToken( payload );

    // Send tokens
    createTokenCookie( 'refresh-token', refreshToken, 604_800_000, req, res ); // 7 days: 7 * 24 * 60 * 60 * 1000
    createTokenCookie( 'access-token', accessToken, 900_000, req, res ); // 15 minutes: 15 * 60 * 1000

    res.status(200).json({ 'success': 'Logged in' });
}

// # Middleware

// Check authentication based on role
export function roles(){
    const roles = Array.from( arguments );

    return async function( req, res, next ){

        // Refresh access token from refresh token
        const refresh = () => {
            let refreshToken = req.cookies['refresh-token'];
            if( !refreshToken ) return res.status(401).json({ 'error': 'Missing token' });

            // Verify token
            let refreshPayload;
            try{ refreshPayload = verifyToken( refreshToken, jwtRefreshPublicKey );
            } catch( error ){ return res.status(401).json({ 'error': 'Invalid token' }); }

            // Create Access token and Rotate refresh token
            [ accessToken, refreshToken ] = rotateRefreshToken( refreshToken );

            // Send tokens
            createTokenCookie( 'refresh-token', refreshToken, 604_800_000, req, res ); // 7 days: 7 * 24 * 60 * 60 * 1000
            createTokenCookie( 'access-token', accessToken, 900_000, req, res ); // 15 minutes: 15 * 60 * 1000

            return false; // no errors occured
        }

        // Get token
        let accessToken = req.cookies['access-token'];

        // Auto Refresh Access token if expired (cookie expired)
        if( !accessToken ){ if( refresh() ) return; }

        // Verify token
        let payload;
        do {
            try{ payload = verifyToken( accessToken, jwtAccessPublicKey );
            } catch( err ){
                // Auto Refresh Access token if expired (token expired, but not cookie)
                if( err.name === 'TokenExpiredError' ){ if( refresh() ) return; }

                else{ return res.status(401).json({ 'error': 'Invalid token' }); }
            }

        } while( payload === undefined );

        console.log( payload )

        // Check if user has required role
        if( !roles.includes( payload.role ) ) return res.status(401).json({ 'error': 'Unauthorized' });

        // Authorised
        next();
    }
}