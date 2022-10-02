
import mongoose from "mongoose";
import Inc from "mongoose-sequence"

const AutoIncrement = Inc(mongoose)

const noteSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type:String,
        required: true
    },
    active: {
        type:Boolean,
        default: false
    }
},{
    timestamps: true
}
)

noteSchema.plugin(AutoIncrement,{
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

export const User = mongoose.model('note',noteSchema)