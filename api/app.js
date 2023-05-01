
import express from "express";
const router = express.Router({ mergeParams: true });

import * as auth from './middleware/authenticate.js';

import { require } from './lib/utils.js';
import { user_roles } from './lib/enums.js';

import Group from './models/queueGroup.js';
import Queue from './models/queue.js';

// ROUTES (/v1/...)

router.use( '/auth', await require('./routes/auth.js') );

router.use( '/create', auth.roles( user_roles.ADMIN ), await require('./routes/create.js') );
router.use( '/search', await require('./routes/search.js') );
router.use( '/get', await require('./routes/get.js') );
router.use( '/join', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD, user_roles.ADMIN ), await require('./routes/join.js') );

//router.use( '/tickets', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD ), await require('./routes/auth.js') );

export default router;