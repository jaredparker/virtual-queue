
import express from 'express';

import * as auth from '../middleware/authenticate.js';
import { user_roles } from '../lib/enums.js';

const router = express.Router();

// ROUTES (/v1/auth/...)

router.post( '/login', auth.login );
router.post( '/logout', auth.logout );
router.post( '/register/user', auth.register, auth.login );
router.post( '/register/anonymous', auth.createAnonymousUser );
router.get( '/check', auth.roles( user_roles.ANONYMOUS, user_roles.STANDARD, user_roles.ADMIN ), ( req, res ) => res.success( 'Logged in' ) );

export default router;