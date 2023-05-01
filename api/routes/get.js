
import express from 'express';

import * as auth from '../middleware/authenticate.js';
import * as params from '../middleware/params.js';
import { user_roles } from '../lib/enums.js';

import Group from '../models/queueGroup.js';
import Queue from '../models/queue.js';

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

export default router;