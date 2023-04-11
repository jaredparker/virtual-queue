
import express from "express";
const router = express.Router();

import * as auth from './middleware/authenticate.js';

import { require } from './lib/utils.js';
import { user_roles } from './lib/enums.js';

// ROUTES (/v1/...)

router.use( '/auth', await require('./routes/auth.js') );

router.use( '/queues', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD ), await require('./routes/queues.js') );
//router.use( '/tickets', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD ), await require('./routes/auth.js') );

export default router;