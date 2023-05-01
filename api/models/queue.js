
import mongoose from 'mongoose';
import { every } from '../lib/enums.js';

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

    timeslots: {
        slots: [{
            startTime: Number,
            duration: Number,
            maxTickets: Number
        }],
        generators: [{
            every: { type: String, enum: every, default: every.DAY },
            start: { type: Number, default: 0 }, // minutes from every
            end: { type: Number, default: 0 }, // minutes from every
            max: Number, // max number of slots to generate
            gap: { type: Number, default: 0 }, // minutes

            slotDuration: Number, // minutes
            slotMaxTickets: { type: Number, default: 1 }, // max number of tickets per slot

            lastGeneration: Number, // unix timestamp
            purgeOldSlots: Boolean
        }] 
    }

    // ... other fields

});

queueSchema.methods.export = function(){
    return {
        type: 'queue',
        id: this.id,
        name: this.name,
        category: this.category,
        location: this.location,
        bannerImage: this.bannerImage,
        waitTimes: [
            { name: 'Virtual', minutes: 54 },
            { name: 'Physical', minutes: 3 }
        ]
    };
}

export default mongoose.model( 'queue', queueSchema );