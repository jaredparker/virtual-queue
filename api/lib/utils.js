
import path from 'path';
import { fileURLToPath } from 'url';

function _getCallerDir() {
    const originalFunc = Error.prepareStackTrace;

    let callerfile;
    try {
        const err = new Error();
        let currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc; 

    const callerDir = callerfile.split( '/' ).slice( 0, -1 ).join( '/' );

    return callerDir;
}

// Dynamic import of module default
export const require = async ( module ) => {
    return await import( path.join( _getCallerDir(), module ) ).then( moduleNamespace => moduleNamespace.default );
}

// Get current directory
export function getDirname( metaURL ){
    return path.dirname( fileURLToPath( metaURL ) );
}