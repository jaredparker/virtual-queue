
import mongoose from 'mongoose';

// DataBase init

const uri = process.env.MONGO_DB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect( uri, options );