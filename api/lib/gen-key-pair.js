
import { generateKeyPair } from 'crypto';
import path from 'path';
import fs from 'fs-extra';

import { getDirname } from './utils.js';

export default function genKeyPair( name ){
    
    // Generate Public and Private Keys
    generateKeyPair( 'rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }

    // Save generated keys to files
    }, ( err, publicKey, privateKey ) => {
        if( err ) throw err;

        const keysDir = path.join( getDirname( import.meta.url ), `../keys/` );
        const pathToPublicKey = `${keysDir}${name}-public.pem`;
        const pathToPrivateKey = `${keysDir}${name}-private.pem`;

        fs.ensureDirSync( keysDir );
        fs.writeFileSync( pathToPublicKey, publicKey );
        fs.writeFileSync( pathToPrivateKey, privateKey );
    });
}