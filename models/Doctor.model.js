const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.Model;

const doctorSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    startedYear: {
        type: Number, 
        min: 1940,
        max: 2025
    },
    availabilities:[
        {
            type: Schema.Types.ObjectId,
            ref: 'TimeSlot'
        }
    ]
}) 



const DoctorProfile = model('DoctorProfile', doctorSchema);


module.exports = DoctorProfile;