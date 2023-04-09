
import express from "express";
const router = express.Router();

import { require } from './lib/utils.mjs';
import { user_roles } from './lib/enums.mjs';

// ROUTES (/v1/...)

router.use( '/auth', await require('./routes/auth.js') );

//app.use( '/queues', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD ), await require('./routes/auth.js') );
//app.use( '/tickets', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD ), await require('./routes/auth.js') );

export default router;