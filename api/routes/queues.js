
import express from 'express';

const router = express.Router();

// ROUTES (/v1/queues/...)

router.get( '/', async ( req, res ) => {
    res.status(200).json({ 'res': 'success!' });
});

export default router;