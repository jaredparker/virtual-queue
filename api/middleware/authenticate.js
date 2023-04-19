
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
const jwtAccessPrivateKey  = getKey( 'jwt-access-private' );

// Public Keys
const jwtRefreshPublicKey = getKey( 'jwt-refresh-public' );
const jwtAccessPublicKey  = getKey( 'jwt-access-public' );

// ### JWT Creation and Verification ###

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

function verifyToken( token, publicKey ){
    return jwt.verify(
        token,
        publicKey,
        { algorithms: ['RS256'] }
    );
}

// # Shortcuts #

async function createRefreshToken( payload, expiresIn='7d' ){
    const refreshToken = createToken( payload, jwtRefreshPrivateKey, expiresIn );

    // Save refresh token to database
    await User.updateOne({ _id: payload.id }, { $push: { refreshTokens: refreshToken } });

    return refreshToken;
}

function createAccessToken( payload, expiresIn='15m' ){
    return createToken( payload, jwtAccessPrivateKey, expiresIn );
}

// # Authentication Tokens Creation, Sending & Rotation #

// Send tokens to client
function createTokenCookie( name, token, expiresIn, req, res ){
    
    const cookieOptions = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    };

    res.cookie( name, token, cookieOptions );
}

async function createSendAuthTokens( payload, req, res ){

    const refreshExpiry = payload.role === user_roles.ANONYMOUS
        ? { text: '1y', milis: 31_536_000_000 } // 1 year: 365 * 24 * 60 * 60 * 1000
        : { text: '7d', milis: 604_800_000 }; // 7 days: 7 * 24 * 60 * 60 * 1000

    // Create tokens
    const refreshToken = await createRefreshToken( payload, refreshExpiry.text );
    const accessToken  = createAccessToken( payload );

    // Send tokens
    createTokenCookie( 'refresh-token', refreshToken, refreshExpiry.milis, req, res ); // 7 days: 7 * 24 * 60 * 60 * 1000
    createTokenCookie( 'access-token', accessToken, 900_000, req, res ); // 15 minutes: 15 * 60 * 1000

    return [ refreshToken, accessToken ];
}

async function rotateRefreshToken( refreshToken, req, res ){
    const oldPayload = verifyToken( refreshToken, jwtRefreshPublicKey ); // Validation expected to be done before this function is called
    const newPayload = { id: oldPayload.id, role: oldPayload.role };

    const foundUser = await User.findOne({ refreshTokens: refreshToken });

    // Reuse detected, revoke tokens
    if( !foundUser ){
        const userID = oldPayload.id;
        await User.updateOne({ _id: userID }, { $set: { refreshTokens: [] } });
        return [ null, null ];
    }

    // Remove old refresh token from database (invalidate use)
    await User.updateOne({ _id: oldPayload.id }, { $pull: { refreshTokens: refreshToken } });

    return await createSendAuthTokens( newPayload, req, res );
}

// ### Middleware/Handlers ###

export async function register( req, res, next ){

    // Get User details
    const { email, password } = req.body;
    if( !email || !password ) return res.failed( 'Missing Username or Password' );

    const user = new User({ email, password, role: user_roles.STANDARD });

    try { await user.save(); }
    catch( error ){ return res.failed( 'Invalid Details' ) }

    // ~ Auto Login user as next middleware
    next(); // login( ...arguments );
}

export async function login( req, res ){

    // Check login details
    const { email, password } = req.body;
    if( !email || !password ) return res.failed( 'Missing Username or Password' );

    // Check if user exists
    const user = await User.findOne({ email });
    if( !user ) return res.failed( 'Invalid username or password' );

    // Check if password matched
    if( !await user.comparePassword( password ) ) return res.failed( 'Invalid username or password' );

    // Create & Send tokens
    const payload = { id: user.id, role: user.role };
    await createSendAuthTokens( payload, req, res );

    res.success( 'Logged in' );
}

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

            // Create Access token, Rotate refresh token & Send tokens
            [ refreshToken, accessToken ] = await rotateRefreshToken( refreshToken, req, res );
            if( accessToken == null ) return res.unauthorized( 'Invalid refresh token' ); // Reuse detected

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
