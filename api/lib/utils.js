
import path from "path";

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

export const require = async ( module ) => {
    return await import( path.join( _getCallerDir(), module ) ).then( moduleNamespace => moduleNamespace.default );
}
