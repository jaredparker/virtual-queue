
import mongoose from 'mongoose';
import { user_roles } from '../lib/enums.js';

const queueSchema = new mongoose.Schema({

    // ~ MongoDB automatically creates an _id field ~
    // id: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

    // TODO: Custom ID

    name: {
        type: String,
        required: true
    },

    // e.g. "Parks", "Rides"
    catergory: {
        default: '',
        type: String
    },

    // latitude,longitude (53.2269855,-0.5491032)
    location: {
        type: String
    },

    // Image ID
    bannerImage: {
        type: String
    },

    // ... other fields

});

export default mongoose.model( 'queue', queueSchema );