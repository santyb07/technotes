
import mongoose from "mongoose";


const usersSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type:String,
        default: 'Employee'
    }],
    active: [{
        type:Boolean,
        default: 'true'
    }]
})

export const User = mongoose.model('User',usersSchema)