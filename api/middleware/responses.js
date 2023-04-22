
export default function responsesMiddleware( req, res, next ){

    // Appply methods to response object

    // Client Errors 400...

    res.failed = ( message='' ) =>
        res.status( 400 ).json({ success: false, message } );
    
    res.missingParams = ( params ) => {
        const details = Object.keys( params ).filter( key => !params[ key ] );
        return res.status( 400 ).json({ success: false, message: 'Missing parameters', details } );
    }

    res.unauthorized = ( details='' ) =>
        res.status( 401 ).json({ success: false, message: 'Unauthorized', details } );

    res.noAccess = ( details='' ) =>
        res.status( 403 ).json({ success: false, message: 'No access to this resource', details } );

    res.notFound = ( details='' ) =>
        res.status( 404 ).json({ success: false, message: 'Resource not found', details } );

    // Successful 200...

    res.success = ( message='' ) =>
        res.status( 200 ).json({ success: true, message } );

    res.data = ( data={} ) =>
        res.status( 200 ).json({ success: true, data } );
    
    next();
}