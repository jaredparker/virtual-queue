
import mongoose from 'mongoose';
import { ticket_types } from '../lib/enums.js';

const ticketSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ticket_types,
        required: true
    },

    queue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queue',
        required: true
    },

    timeslot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queue.timeslots.slots'
    },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],

});

ticketSchema.methods.export = function(){
    return {
        type: 'ticket',
        id: this._id,
        ticketType: this.type,
    };
}

ticketSchema.methods.fullExport = async function(){
    await this.populate( 'queue' );

    const timeslot = this.queue.timeslots.slots.find( s => s._id.equals( this.timeslot ) );

    return {
        type: 'ticket',
        id: this._id,
        ticketType: this.type,
        queue: this.queue.export(),
        timeslot: timeslot ? timeslot.export() : null,
    }
}

export default mongoose.model( 'ticket', ticketSchema );