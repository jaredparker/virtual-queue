
import dayjs from 'dayjs';

import mongoose from 'mongoose';
import { every, physical_queue_types } from '../lib/enums.js';

const previewTicket = new mongoose.Schema({

    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket',
        required: true
    },

    // Preview data
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],

    // Preview data
    calledAt: Number,

    served: Boolean
});

const slot = new mongoose.Schema({
    startTime: Number,
    duration: Number,
    maxTickets: Number,
    tickets: [previewTicket]
});

slot.methods.export = function(){
    return {
        id: this._id,
        startTime: this.startTime,
        duration: this.duration,
    };
}

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

    standby: {
        tickets: [previewTicket],
    },

    timeslots: {

        slots: [slot],

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
    },

    physical: {
        ...Object.values(physical_queue_types).reduce(( obj, type ) => ({
            ...obj,
            [type]: {
                members: { type: Number, default: 0 }, // Not possible to track specific tickets in physical queues, too many 
                capacity: { type: Number, default: 1 },
            } 
        }),{})
    },

    // minutes per service
    serviceRate: {
        type: Number,
        required: true,
        default: 10
    },
    // how many members can be served at once
    serviceCapacity: {
        type: Number,
        required: true,
        default: 1
    },

    // ... other fields

});

queueSchema.methods.export = function(){
    const now = dayjs()

    return {
        type: 'queue',
        id: this._id,
        name: this.name,
        category: this.category,
        location: this.location,
        bannerImage: this.bannerImage,
        waitTimes: [
            { name: 'Virtual', minutes: 54 },
            { name: 'Physical', minutes: 3 }
        ],
        timeslots: this.timeslots.slots.filter( slot => dayjs.unix(slot.startTime-slot.duration).isAfter(now) ).map( slot => ({
            id: slot._id,
            startTime: slot.startTime,
            duration: slot.duration,
        })),
    };
}

// Next members to be served

queueSchema.methods.nextStandbyMembers = async function(){
    
    // TODO: Check if standby enabled

    const virtualStandbyQueue  = this.standby;
    const physicalStandbyQueue = this.physical[physical_queue_types.STANDBY];

    // Get next tickets up to capacity
    const maxTickets  = physicalStandbyQueue.capacity - physicalStandbyQueue.members;
    const nextTickets = this.callNextMembers( virtualStandbyQueue, maxTickets );

    return nextTickets.length
        ? { success: true, data: nextTickets }
        : virtualStandbyQueue.tickets.length
        ? { success: false, message: `Could not add members to queue because physical ${physical_queue_types.STANDBY} queue is full` }
        : { success: false, message: `No ${physical_queue_types.STANDBY} members to add to physical ${physical_queue_types.STANDBY} queue` };
}


queueSchema.methods.nextAdvanceMembers = function(){
    // Advance tickets can join any time during their timeslot
}


queueSchema.methods.nextMergedMembers = async function(){

    //const now = dayjs().utc();
    const now = dayjs.unix( 1683122460 ); // GMT 15:01

    const virtualStandbyQueue = this.standby;
    const physicalMergedQueue = this.physical[physical_queue_types.MERGED];

    let maxNextStandby = 0;
    const standbyThreshold = 0;

    if( physicalMergedQueue.members >= physicalMergedQueue.capacity*standbyThreshold ){

        // Compute max processing capacity till next timeslot

        const currTimeslot = this.timeslots.slots.find( slot => slot.startTime <= now.unix() && slot.startTime + slot.duration >= now.unix() );
        const nextTimeslot = this.timeslots.slots.find( slot => slot.startTime > now.unix() ); // Expects slots to be sorted // ~ another find as currTimeslot might be undefined during gap

        const timeTillNextSlotMinutes = dayjs.unix( nextTimeslot.startTime ).diff( now, 'minutes' );
        const maxProcessingCapacity = Math.floor( ( timeTillNextSlotMinutes / this.serviceRate ) * this.serviceCapacity );

        const leftoverCapacity    = maxProcessingCapacity - physicalMergedQueue.members;
        const advanceYetToAttend  = currTimeslot ? currTimeslot.tickets.reduce( ( sum, ticket ) => ticket.served ? sum : sum + ticket.users.length, 0 ) : 0;
        // safeStandbyCapacity is how many standby members can be added to physical queue without exceeding maxProcessingCapacity or taking away space from advance members
        // ~ however, this can be larger than the available physical queue capacity
        const safeStandbyCapacity = leftoverCapacity - advanceYetToAttend;

        // Padd physical queue with enough space for advance members to be served
        let extraPhysicalSpace = physicalMergedQueue.capacity - physicalMergedQueue.members - advanceYetToAttend;
        
        maxNextStandby = Math.min( safeStandbyCapacity, extraPhysicalSpace );

    } else {
        // Not enough members in physical queue to prioritize yet to attend advance members

        maxNextStandby = physicalMergedQueue.capacity*standbyThreshold - physicalMergedQueue.members;
    }

    // Get next tickets up to capacity
    const nextTickets = this.callNextMembers( virtualStandbyQueue, maxNextStandby );
    
    return nextTickets.length
        ? { success: true, data: nextTickets }
        : virtualStandbyQueue.tickets.length
        ? { success: false, message: `Could not add members to queue because physical ${physical_queue_types.MERGED} queue cannot handle more ${physical_queue_types.STANDBY} members` }
        : { success: false, message: `No ${physical_queue_types.STANDBY} members to add to physical ${physical_queue_types.MERGED} queue` };
}


queueSchema.methods.callNextMembers = function( queue, max ){

    // Get next tickets up to capacity
    const nextTickets = [];
    let processed = 0;
    for( const ticket of queue.tickets ){
        if( processed + ticket.users.length > max ) break; // Capacity reached

        nextTickets.push( ticket );
        processed += ticket.users.length;
    }

    // Call next tickets
    const now = dayjs().unix();
    for( const ticket of nextTickets ){
        if( ticket.calledAt==null ) ticket.calledAt = now; // TODO: Add called at timeout (added to back of the queue if not accepted in time)
        // TODO: Push to users
    }

    return nextTickets;
}


export default mongoose.model( 'queue', queueSchema );