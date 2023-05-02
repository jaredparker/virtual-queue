
import express from 'express';
import dayjs from 'dayjs';

import * as auth from '../middleware/authenticate.js';
import * as params from '../middleware/params.js';
import { user_roles, ticket_types } from '../lib/enums.js';

import Group from '../models/queueGroup.js';
import Queue from '../models/queue.js';
import Ticket from '../models/ticket.js';

const router = express.Router();

// ROUTE PARAMS

router.param( 'queueID', params.queueID );
router.param( 'timeslotID', params.timeslotID );

// MIDDLEWARE

async function checkActiveTicket( req, res, next ) {

    // Check if user currently in standby queue
    const standby = req.queue.standby.tickets.find( t =>t.users.find( u => u._id.equals( req.userID ) ) );
    if( standby ) return res.failed( `User '${req.userID}' already has a ticket in standby queue '${req.queue._id}'` );

    // Check if user currently in a timeslot that hasn't ended yet
    const now = dayjs();
    const timeslot = req.queue.timeslots.slots.find( s => {
        // Find active timeslot

        // Check if timeslot has passed
        // ~ user cannot join a new timeslot if their previous timeslot hasn't ended yet
        if( now.isAfter( dayjs.unix( s.startTime + s.duration ) ) ) return false;

        // Check if user is in this timeslot
        return s.tickets.find( t => t.users.find( u => u._id.equals( req.userID ) ) );
    })
    if( timeslot ) return res.failed( `User '${req.userID}' already has a ticket in timeslot '${timeslot._id}'` );

    next();
}

// ROUTES (/v1/join...)

router.post( `/queue/:queueID/${ticket_types.STANDBY}`, checkActiveTicket, async ( req, res ) => {

    // Check if user currently in any standby queue
    const standbyAll = await Queue.findOne({ 'standby.tickets.users': req.userID });
    if( standbyAll ) return res.failed( `User '${req.userID}' already has a ticket in a standby queue '${standbyAll._id}'` );


    const ticket = new Ticket({
        type: ticket_types.STANDBY,
        queue: req.queue._id,
        users: [ req.userID ]
    });

    req.queue.standby.tickets.push({
        ticket: ticket._id,
        users: [ req.userID ]
    });

    try {
        await req.queue.save();
        await ticket.save();

        // Success
        res.data({ id: ticket._id });

    } catch( err ){ return res.failed( err.message ); }
});

router.post( `/queue/:queueID/${ticket_types.ADVANCE}/:timeslotID`, checkActiveTicket, async ( req, res ) => {

    // Check timeslot hasn't started
    if( dayjs().isAfter( dayjs.unix( req.timeslot.startTime ) ) ) return res.failed( `Timeslot '${req.timeslot._id}' has already started` );

    // Check if the timeslot is full
    const users = [ req.userID ];
    const slotUsers = req.timeslot.tickets.reduce( ( acc, t ) => acc + t.users.length, 0 );
    if( slotUsers + users.length >= req.timeslot.maxTickets ) return res.failed( `Timeslot '${req.timeslot._id}' is full` );

    // Add the ticket to the timeslot
    const ticket = new Ticket({
        type: ticket_types.ADVANCE,
        queue: req.queue._id,
        users,
        timeslot: req.timeslot._id
    });

    req.timeslot.tickets.push({
        ticket: ticket._id,
        users
    });

    try {
        await req.queue.save();
        await ticket.save();

        // Success
        res.data({ id: ticket._id });

    } catch( err ){ return res.failed( err.message ); }
});

export default router;