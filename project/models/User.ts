import mongoose, { models } from 'mongoose';
import { model , Schema } from 'mongoose';

const UserSchema = new Schema({
    email: {type : String , required: true },
    username: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: [Number], 
        default: [],
    },
    userType: {
        type: String,
        enum: ['user', 'organizer'], 
        required: true,
    }

})

const User = models.User || model('User' , UserSchema);

export default User;