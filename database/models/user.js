
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    id: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
    }
});

export default mongoose.model( 'user', userSchema );