
import express from 'express';

import * as auth from '../middleware/authenticate.js';

const router = express.Router();

// ROUTES (/v1/auth/...)

router.post( '/login', auth.login );

export default router;