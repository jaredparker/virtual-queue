
import express from 'express';

import * as auth from '../middleware/authenticate.js';
import { user_roles } from '../lib/enums.js';

import Group from '../models/queueGroup.js';
import Queue from '../models/queue.js';

const router = express.Router();

// ADMIN ROUTES (/v1/queues/...)

router.post(
    '/create/group',
    auth.roles( user_roles.ADMIN ),
    async ( req, res ) => {

        const { name, bannerImage, parentGroupID } = req.body;
        if( !name ) return res.missingParams( { name } );

        let parentGroup;
        if( parentGroupID ){
            try{ parentGroup = await Group.findOne({ _id: parentGroupID }); }
            catch( err ){ return res.failed( `Parent Group '${parentGroupID}' doesn't exist` ); }
        }

        const groupData = { name, bannerImage };
        if( parentGroup ) groupData.parent = parentGroup._id;

        const group = new Group(groupData);
        try{ await group.save(); }
        catch( err ){ return res.failed( err.message ); }

        res.data({ id: group.id });
    }
);

router.post(
    '/create/queue',
    auth.roles( user_roles.ADMIN ),
    async ( req, res ) => {

        const { name, bannerImage, parentGroupID } = req.body;
        if( !name ) return res.missingParams( { name } );

        let parentGroup;
        if( parentGroupID ){
            try{ parentGroup = await Group.findOne({ _id: parentGroupID }); }
            catch( err ){ return res.failed( `Parent Group '${parentGroupID}' doesn't exist` ); }
        }

        const queue = new Queue({ name, bannerImage });
        try{ await queue.save(); }
        catch( err ){ return res.failed( err.message ); }

        if( parentGroup ){
            parentGroup.children.push( queue._id );
            try{ await parentGroup.save(); }
            catch( err ){
                await Queue.deleteOne({ _id: queue._id });
                return res.failed( err.message );
            }
        }

        res.data({ id: queue.id });
    }
);

// ROUTES (/v1/queues/...)

router.get(
    '/get',
    auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD, user_roles.ADMIN ),
    async ( req, res ) => {

        const groups = await Group.find({ parent: { $exists: false } });
        console.log( groups );
    }
);

export default router;