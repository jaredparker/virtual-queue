
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { user_roles } from '../lib/enums.js';

const userSchema = new mongoose.Schema({

    // ~ MongoDB automatically creates an _id field ~
    // id: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String
    },

    name: {
        type: String,
    },

    role: {
        type: String,
        enum: user_roles,
        required: true
    },

    // Array for multiple logins
    refreshTokens: {
        type: [String],
    }
});

// Encrypt password
userSchema.pre('save', async function( next ){
    if( !this.password || !this.isModified('password') ){ return next(); }
  
    this.password = await bcrypt.hash( this.password, 10 );
    next();
});

userSchema.methods.comparePassword = async function( password ){
    return await bcrypt.compare( password, this.password );
};

export default mongoose.model( 'user', userSchema );