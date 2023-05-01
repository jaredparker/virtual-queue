
import Group from '../models/queueGroup.js';
import Queue from '../models/queue.js';

// ROUTE PARAMS

export async function groupID( req, res, next, value ){
    
    try{ req.group = await Group.findOne({ _id: value }); }
    catch( err ){ return res.notFound(); }

    // Group ID is invalid
    if( !req.group ){ return res.notFound(); }

    next();
};

export async function queueID( req, res, next, value ){

    try{ req.queue = await Queue.findOne({ _id: value }); }
    catch( err ){ return res.notFound(); }

    // Queue ID is invalid
    if( !req.queue ){ return res.notFound(); }

    next();
};