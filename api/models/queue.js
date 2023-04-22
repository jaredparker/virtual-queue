
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
    category: {
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

queueSchema.methods.export = function(){
    return {
        type: 'queue',
        id: this.id,
        name: this.name,
        category: this.category,
        location: this.location,
        bannerImage: this.bannerImage
    };
}

export default mongoose.model( 'queue', queueSchema );