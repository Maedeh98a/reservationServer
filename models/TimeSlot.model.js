const {model, Schema} = require("mongoose");

const timeSlotSchema = new Schema({
    doctor: {type: Schema.Types.ObjectId , 
        ref: 'DoctorProfile',
        required: true
    },
    date:{
        type: [Date],
        required: true
    },
    start:{
        type: String,
        required: true
    },
    end:{
        type: String,
        required: true
    },
    isBooked:{
        type:Boolean,
        default: false
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'PatientProfile', 
        default: null
    }
})



const TimeSlot = model('TimeSlot', timeSlotSchema)
module.exports = TimeSlot;