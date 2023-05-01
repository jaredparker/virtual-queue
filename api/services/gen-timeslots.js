
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
dayjs.extend( utc );
dayjs.extend( isSameOrBefore );

import mongoose from 'mongoose';
import Queue from '../models/queue.js';

class TimeslotGenerator {

    constructor( queueID, genID, { every, start, end, max, gap, slotDuration, slotMaxTickets }){

        this.queueID = queueID;
        this.genID = genID;

        this.genEvery = every;
        this.genStartOffset = start;
        this.genEndOffset = end;
        this.genMax = max;
        this.genGap = gap;

        this.slotDuration = slotDuration;
        this.slotMaxTickets = slotMaxTickets;

        this._timeout = null;
    }

    async start( initGen=false ){

        // Initiate generation
        if( initGen ) await this.generate( Date.now() );

        const now     = dayjs().utc();
        const nextGen = dayjs().utc().add( 1, this.genEvery ).startOf( this.genEvery );

        const milis = nextGen.diff( now );

        const maxTimeout = 2147483647;
        const _setTimeout = ( cb, timeout ) => {
            clearTimeout( this._timeout );

            // Max timeout value 
            if( timeout > maxTimeout ){
                this._timeout = setTimeout( () => _setTimeout( cb, timeout - maxTimeout ), maxTimeout );
                return this._timeout;
            }

            this._timeout = setTimeout( cb, timeout );
            return this._timeout;
        }

        _setTimeout( async () => {

            await this.generate( nextGen );
            this.start();

        }, milis );

        return this;
    }

    async stop(){
        clearTimeout( this._timeout );

        return this;
    }

    async generate( timestamp ){

        const start   = dayjs( timestamp ).utc().startOf( this.genEvery )
        const startAt = start.add( this.genStartOffset, 'minutes' );
        const endAt   = start.add( this.genEndOffset, 'minutes' );

        // Check if generator has been ran already or been deleted
        // ~ Database queried once to avoid validation inconsistencies
        const [ valid, queue, gen ] = await this.validateGen( start );
        if(!valid) return false;

        // Generate slots
        const slots = this.createSlots( startAt, endAt );

        // Save to Database
        gen.lastGeneration = start.unix();
        queue.timeslots.slots = gen.purgeOldSlots ? slots : queue.timeslots.slots.concat( slots );

        try {
            await queue.save();
            console.log( 'generated' );

        } catch( err ){
            if( err instanceof mongoose.Error.VersionError ){
                console.log( 'version mismatch, retrying...' );
                return this.generate( timestamp );
            } else {
                console.log( err );
            }
        }

        return this;
    }

    async validateGen( startTime ){

        const queue = await Queue.findById( this.queueID );
        if( !queue ) return [ false, null, null ]; // Queue has been deleted

        const gen = queue.timeslots.generators.find( g => g._id.equals( this.genID ) );
        if( !gen ) return [ false, queue, null ]; // Generator has been deleted

        // Generator hasn't been run yet
        if( !gen.lastGeneration ) return [ true, queue, gen ];

        // Generator has been ran already for current interval
        const lastGen = dayjs.unix( gen.lastGeneration ).utc();
        const diff    = startTime.diff( lastGen );
        if( diff <= 0 ) return [ false, null, null ];

        // Generator hasn't been ran for current interval
        return [ true, queue, gen ];
    }

    createSlots( startAt, _endAt ){
        const endAt = _endAt.subtract( this.slotDuration, 'minutes' ); // Subtract slot duration to prevent overflow

        let slots = [];

        let current = startAt;
        while( current.isSameOrBefore( endAt ) ){

            let slot = {
                startTime: current.unix(),
                duration: this.slotDuration * 60, // minutes to unix
                maxTickets: this.slotMaxTickets
            };

            slots.push( slot );

            current = current.add( this.slotDuration + this.genGap, 'minutes' );
        }

        return slots;
    }
}

const generators = {};
async function reloadGenerators( queueID ){

    if( generators[ queueID ] ){
        console.log( 'stopping', queueID );
        console.log( generators[ queueID ] );
        generators[ queueID ].forEach( gen => gen.stop() );
        delete generators[ queueID ];
    }
    
    const queue = await Queue.findById( queueID );
    if( !queue ) return;
    if( !queue.timeslots?.generators?.length ) return;

    const gens = queue.timeslots.generators.map(
        gen => new TimeslotGenerator( queue._id, gen._id, gen )
    );
    gens.forEach( gen => gen.start( true ) );

    generators[ queueID ] = gens;
}

// Watch for database changes
Queue.watch().on( 'change', async data => {

    switch( data.operationType ){

        case 'update':
            const genUpdate = Object.keys(data.updateDescription.updatedFields)
                .find( field => field.endsWith( '.lastGeneration' ) );
            if( genUpdate ) return;
            reloadGenerators( data.documentKey._id );
            break;

        case 'insert':
            reloadGenerators( data.fullDocument._id );
            break;
        
        case 'delete':
            reloadGenerators( data.documentKey._id );
            break;
        
        default:
            break;
    }
});

// Init

const queues = await Queue.find();
queues.forEach( queue => reloadGenerators( queue._id ) );