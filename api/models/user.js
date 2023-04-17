
import mongoose from 'mongoose';
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

    // TODO: encrypt password

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

export default mongoose.model( 'user', userSchema );