
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

// HELPER FUNCTIONS

function formatQuery( query ){
    return {
        db: { name: { $regex: query, $options: 'i' } },
        regex: new RegExp( query, 'i' )
    }
}

// ROUTES (/v1/search...)

router.get( '/directory/:groupID?', async ( req, res ) => {
    const query = req.query.q ? formatQuery( req.query.q ) : {};

    // Search groups
    const groups = req.group
        ? await Group.find({ parent: req.group._id, ...query.db }) // search group's group children
        : await Group.find({ parent: { $exists: false }, ...query.db }); // search root
    
    // Search queues
    if( req.group ) await req.group.populate('children');
    const queues = req.group
        ? req.group.children.filter( queue => req.query.q ? query.regex.test( queue.name ) : true) // search group's queue children
        : []; // search root, NOT IMPLEMENTED: queues not witihin a group's children

    // Build response
    const responseData = {
        directory: req.group ? req.group.export() : 'root',
        results: [
            ...groups.map( group => group.export() ),
            ...queues.map( queue => queue.export() )
        ]
    }

    res.data( responseData );
});

router.get( '/all', async ( req, res ) => {

    const query = req.query.q ? formatQuery( req.query.q ) : {};

    // Search everything
    const groups = await Group.find( query.db );
    const queues = await Queue.find( query.db );

    // Categorise results
    const categoryAsParentTree = async model => {
        const data = model.export();
        const tree = [];

        const getGroupParents = async group => {
            await group.populate('parent');
            if( group.parent ){
                tree.unshift( group.parent.name );
                getGroupParents( group.parent );
            }
        }

        // Model is a queue
        if( data.type == 'queue' ){
            const parentGroup = await Group.findOne({ children: data.id });
            if( parentGroup ) tree.unshift( parentGroup.name );
            await getGroupParents( parentGroup );

        // Model is a group
        } else {
            await getGroupParents( model );
        }

        data.category = tree.join(' > ');
        return data;
    }

    // Build response
    const responseData = {
        results: [
            ...(await Promise.all( queues.map( categoryAsParentTree ) )),
            ...(await Promise.all( groups.map( categoryAsParentTree ) ))
        ]
    };

    res.data( responseData );
});

export default router;