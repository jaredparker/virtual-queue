
import mongoose from 'mongoose';

import User from './models/user';


export const connect = mongoose.connect;
export const User = User;