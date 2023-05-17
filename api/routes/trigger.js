
import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend( utc );

import * as auth from '../middleware/authenticate.js';
import * as params from '../middleware/params.js';
import { user_roles, ticket_types, physical_queue_types } from '../lib/enums.js';

import Group from '../models/queueGroup.js';
import Queue from '../models/queue.js';

const router = express.Router();

// ROUTE PARAMS

router.param( 'queueID', params.queueID );
router.param( 'timeslotID', params.timeslotID );
router.param( 'ticketID', params.ticketID );

// ROUTES (/v1/trigger...)

router.post( `/queue/:queueID/${physical_queue_types.STANDBY}/nextmembers`, async ( req, res ) => {

    const result = await req.queue.nextStandbyMembers();

    if( !result.success ) return res.failed( result.message );

    try {
        await req.queue.save();
        return res.data( result.data );

    } catch( error ){
        return res.failed( error.message );
    }
});

router.post( `/queue/:queueID/${physical_queue_types.MERGED}/nextmembers`, async ( req, res ) => {

    const result = await req.queue.nextMergedMembers();

    if( !result.success ) return res.failed( result.message );

    try {
        await req.queue.save();
        return res.data( result.data );

    } catch( error ){
        return res.failed( error.message );
    }
});

// Ticket Validation Middleware

const isUnusedTicket = async ( req, res, next ) => {
    if( req.ticket.usedAt !== undefined ) return res.failed( 'Ticket has already been used' );

    // Ticket is unused
    return next();
}

const validateAdvance = async ( req, res, next ) => {

    // Advance ticket
    if( req.ticket.type == ticket_types.ADVANCE ){

        const now = dayjs().unix();
        const timeslot = req.queue.timeslots.slots.find( s => s._id.equals( req.ticket.timeslot ) );
        if( timeslot === undefined ) return res.failed( 'Advance Ticket is not for this queue' );

        const isCurrentSlot = timeslot.startTime <= now && timeslot.startTime+timeslot.duration >= now;
        if( !isCurrentSlot ) return res.failed( 'Advance ticket is not valid for this timeslot' );

    } else { return next(); }

    // Advance ticket is valid
    invalidateUsedTicket( req, res, next );
}

const validateStandby = async ( req, res, next ) => {

    // Standby ticket
    if( req.ticket.type == ticket_types.STANDBY ){

        const standby = req.queue.standby.tickets.find( t => t.ticket._id.equals( req.ticket._id ) );
        if( standby === undefined ) return res.failed( 'Standard Ticket is not for this queue' );

        const isCalled = standby.calledAt !== undefined;
        if( !isCalled ) return res.failed( 'Standard ticket has not been called' );

    } else { return next(); }

    // Standby ticket is valid
    invalidateUsedTicket( req, res, next );
}

const invalidateUsedTicket = async ( req, res, next ) => {
    
    // Ticket Valid, Invalidate future use
    req.ticket.usedAt = dayjs().unix();
    try {
        await req.ticket.save();
        return res.data( req.ticket );

    } catch( error ){
        return res.failed( error.message );
    }
}

router.post( `/queue/:queueID/${physical_queue_types.STANDBY}/verifyticket/:ticketID`, isUnusedTicket, validateStandby );
router.post( `/queue/:queueID/${physical_queue_types.ADVANCE}/verifyticket/:ticketID`, isUnusedTicket, validateAdvance );
router.post( `/queue/:queueID/${physical_queue_types.MERGED}/verifyticket/:ticketID`, isUnusedTicket, validateAdvance, validateStandby );

export default router;