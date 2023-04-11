
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

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
async function createRefreshToken( payload, expiresIn='7d' ){
    const refreshToken = createToken( payload, jwtRefreshPrivateKey, expiresIn );

    // Save refresh token to database
    await User.updateOne({ _id: payload.id }, { $push: { refreshTokens: refreshToken } });

    return refreshToken;
}
function createAccessToken( payload, expiresIn='15m' ){
    return createToken( payload, jwtAccessPrivateKey, expiresIn );
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

async function rotateRefreshToken( refreshToken, expiresIn='7d' ){
    const oldPayload = verifyToken( refreshToken, jwtRefreshPublicKey ); // Validation expected to be done before this function is called
    const newPayload = { id: oldPayload.id, role: oldPayload.role };

    // TODO: Add validation with database for reuse detection
    const foundUser = await User.findOne({ refreshTokens: refreshToken });

    // Reuse detected, revoke tokens
    if( !foundUser ){
        const userID = oldPayload.id;
        await User.updateOne({ _id: userID }, { $set: { refreshTokens: [] } });
        return [ null, null ];
    }

    // Remove old refresh token from database (invalidate use)
    await User.updateOne({ _id: oldPayload.id }, { $pull: { refreshTokens: refreshToken } });

    const newRefreshToken = await createRefreshToken( newPayload, expiresIn );
    const newAccessToken  = createAccessToken( newPayload );

    return [ newAccessToken, newRefreshToken ];
}

// # Handlers

export async function register( req, res, next ){

    // Get User details
    const { email, password } = req.body;
    if( !email || !password ) return res.failed( 'Missing Username or Password' );

    const user = new User({ email, password, role: user_roles.STANDARD });

    try { await user.save(); }
    catch( error ){ return res.failed( 'Invalid Details' ) }

    // Login user
    //login( ...arguments );
    next();
}

export async function login( req, res ){

    // Check login details
    const { email, password } = req.body;
    if( !email || !password ) return res.failed( 'Missing Username or Password' );

    // Check if user exists
    const user = await User.findOne({ email });
    if( !user ) return res.failed( 'Invalid username or password' );

    // Check if password matched

    // Create tokens
    const payload = { id: user.id, role: user.role };
    const refreshToken = await createRefreshToken( payload );
    const accessToken = createAccessToken( payload );

    // Send tokens
    createTokenCookie( 'refresh-token', refreshToken, 604_800_000, req, res ); // 7 days: 7 * 24 * 60 * 60 * 1000
    createTokenCookie( 'access-token', accessToken, 900_000, req, res ); // 15 minutes: 15 * 60 * 1000

    res.success( 'Logged in' );
}

// # Middleware

// Check authentication based on role
export function roles(){
    const roles = Array.from( arguments );

    return async function( req, res, next ){

        // Refresh access token from refresh token
        const refresh = async () => {
            let refreshToken = req.cookies['refresh-token'];
            if( !refreshToken ) return res.unauthorized( 'Missing refresh token' );

            // Verify token
            let refreshPayload;
            try{ refreshPayload = verifyToken( refreshToken, jwtRefreshPublicKey );
            } catch( error ){ return res.unauthorized( 'Invalid refresh token' ); }

            // Create Access token and Rotate refresh token
            [ accessToken, refreshToken ] = await rotateRefreshToken( refreshToken );
            if( accessToken == null ) return res.unauthorized( 'Invalid refresh token' ); // Reuse detected

            // Send tokens
            createTokenCookie( 'refresh-token', refreshToken, 604_800_000, req, res ); // 7 days: 7 * 24 * 60 * 60 * 1000
            createTokenCookie( 'access-token', accessToken, 900_000, req, res ); // 15 minutes: 15 * 60 * 1000

            return false; // no errors occured
        }

        // Get token
        let accessToken = req.cookies['access-token'];

        // Auto Refresh Access token if expired (cookie expired)
        if( !accessToken ){ if( await refresh() ){ return; } }

        // Verify token
        let payload;
        do {
            try{ payload = verifyToken( accessToken, jwtAccessPublicKey );
            } catch( err ){
                // Auto Refresh Access token if expired (token expired, but not cookie)
                if( err.name === 'TokenExpiredError' ){ if( await refresh() ) return; }

                else{ return res.unauthorized( 'Invalid access token' ) }
            }

        } while( payload === undefined );

        // Check if user has required role
        if( !roles.includes( payload.role ) ) return res.noAccess( 'Insufficient permissions');

        // Authorised
        next();
    }
}