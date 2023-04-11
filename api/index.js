
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

import { require } from './lib/utils.js';

// INIT

if( process.env.NODE_ENV !== 'production' ) dotenv.config();

import './services/db.js';

const app = express();
const server = http.createServer(app);

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( cookieParser() );

app.use( await require('./middleware/responses.js') );

// ROUTES (/...)

app.get( '/', ( req, res ) => {
    res.data({ 'foo': 'bar' });
});

app.use( '/v1', await require('./app.js') );

// START SERVER

server.listen( process.env.PORT || 443, _ => {
    console.log( `Listening at ${server.address().address}:${server.address().port}` );
});