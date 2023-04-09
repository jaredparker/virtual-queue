
import express from 'express';

const router = express.Router();

// ROUTES (/v1/auth/...)

router.post( '/login', async ( req, res ) => {
    res.status(200).json({ 'yes': 'bar' });
});

export default router;