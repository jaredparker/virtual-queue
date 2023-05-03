
import express from 'express';
import dayjs from 'dayjs';

import * as auth from '../middleware/authenticate.js';
import * as params from '../middleware/params.js';
import { ticket_types, user_roles } from '../lib/enums.js';

import Group from '../models/queueGroup.js';
import Queue from '../models/queue.js';
import Ticket from '../models/ticket.js';

const router = express.Router();

// ROUTE PARAMS

router.param( 'groupID', params.groupID );
router.param( 'queueID', params.queueID );

// ROUTES (/v1/get...)

router.get( '/queue/:queueID', async ( req, res ) => {

    const responseData = req.queue.export();

    const parentGroup = await Group.findOne({ children: req.queue._id });
    responseData.parentGroup = (parentGroup) ? parentGroup.export() : null;

    res.data( responseData );
});

router.get( '/group/:groupID', async ( req, res ) => {

    const responseData = req.group.export();

    await req.group.populate('parent');
    const parentGroup = req.group.parent;
    responseData.parentGroup = (parentGroup) ? parentGroup.export() : null;

    res.data( responseData );
});

router.get( '/tickets', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD, user_roles.ADMIN ), async ( req, res ) => {

    const tickets = await Ticket.find({ users: req.userID });

    const responseData = await Promise.all( tickets.map( ticket => ticket.fullExport() ) );
    responseData.sort(( a, b ) => {
        return ( a.ticketType == ticket_types.ADVANCE )
            ? ( a.ticketType == b.ticketType )
            ? ( a.timeslot==null || b.timeslot==null ) ? 0 : dayjs.unix( a.timeslot.startTime ).diff( dayjs.unix( b.timeslot.startTime ) )
            :  1  // b is standby
            : -1; // a is standby
    });

    res.data( responseData );
});

export default router;