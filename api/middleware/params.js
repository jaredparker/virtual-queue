
import Group from '../models/queueGroup.js';
import Queue from '../models/queue.js';
import Ticket from '../models/ticket.js';

// ROUTE PARAMS

export async function groupID( req, res, next, value ){
    
    try{ req.group = await Group.findOne({ _id: value }); }
    catch( err ){ return res.notFound('Group'); }

    // Group ID is invalid
    if( !req.group ){ return res.notFound('Group'); }

    next();
};

export async function queueID( req, res, next, value ){

    try{ req.queue = await Queue.findOne({ _id: value }); }
    catch( err ){ return res.notFound('Queue'); }

    // Queue ID is invalid
    if( !req.queue ){ return res.notFound('Queue'); }

    next();
};

export async function ticketID( req, res, next, value ){

    try{ req.ticket = await Ticket.findOne({ _id: value }); }
    catch( err ){ return res.notFound('Ticket'); }

    // Ticket ID is invalid
    if( !req.ticket ){ return res.notFound('Ticket'); }

    next();
};

export async function timeslotID( req, res, next, value ){

    // Find timeslot's queue
    let queue;
    
    // Queue not in request
    if( !req.queue ){
        try{ req.queue = await Queue.findOne({ 'timeslots.slots._id': value }); }
        catch( err ){ return res.notFound('Timeslot'); }
        if( !req.queue ) return res.notFound('Timeslot');
    }

    // Find timeslot in queue
    req.timeslot = req.queue.timeslots.slots.find( s => s._id.equals( value ) );
    if( !req.timeslot ) return res.notFound('Timeslot');

    next();
};