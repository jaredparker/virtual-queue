
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

if( process.env.NODE_ENV !== 'production' ) dotenv.config();

// DataBase init

const uri = process.env.MONGO_DB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect( uri, options );