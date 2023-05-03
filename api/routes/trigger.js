
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


export default router;