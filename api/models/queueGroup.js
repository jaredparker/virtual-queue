
import mongoose from 'mongoose';
import { user_roles } from '../lib/enums.js';

const queueGroupSchema = new mongoose.Schema({
    
    // TODO: Custom ID
    // ~ MongoDB automatically creates an _id field ~
    // id: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

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

    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queueGroup'
    },

    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queue'
    }],

});

queueGroupSchema.methods.export = function(){
    return {
        type: 'group',
        id: this.id,
        name: this.name,
        category: this.category,
        location: this.location,
        bannerImage: this.bannerImage
    };
}

export default mongoose.model( 'queueGroup', queueGroupSchema );