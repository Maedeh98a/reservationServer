const {Schema, model} = require("mongoose");

const patientSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOfBirth: {
        type: Date, 
        required: true
    },
    history:[String],
    reservation: {
        type: Schema.Types.ObjectId,
        ref: 'TimeSlot'
    }

})

const PatientProfile = model('Patient', patientSchema);
module.exports = PatientProfile;