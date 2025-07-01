const router = require("express").Router();
const doctorModel = require("../models/Doctor.model");
const patientModel = require("../models/Patient.model");
const userModel = require("../models/User.model");
const timeSlot = require("../models/TimeSlot.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");



router.post("/availability", isAuthenticated, async (req, res)=>{
    try {
        const doctorId = req.payload.doctorId;
        const {date, start, end} =req.body;
        const newSlot = await timeSlot.create({
            doctor: doctorId, 
            date, 
            start, 
            end
        });
        await doctorModel.findByIdAndUpdate(doctorId,{
            $push:{availabilities: newSlot._id}},
            {new: true}
        )
        res.status(201).json(newSlot)
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/availability/:doctorId", isAuthenticated, async (req, res)=>{
    try {
        const doctorAvailabilities = await timeSlot.find({doctor: req.params.doctorId});
         res.status(200).json(doctorAvailabilities);

    } catch (error) {
        console.log(error);
    }
})

router.put("/updateTimeslot/:itemId", isAuthenticated, async(req, res)=>{
    try {
        const updatedTimeslot = await timeSlot.findByIdAndUpdate(req.params.itemId, {
            date: req.body.date,
            start: req.body.start,
            end: req.body.end
        }, {new:true});
        res.status(200).json(updatedTimeslot);
        
    } catch (error) {
        console.log(error);
    }
})

router.delete("/deleteTimeslot/:itemId", isAuthenticated , async(req, res)=>{
    try {
        const deletedTimeslot = await timeSlot.findByIdAndDelete(req.params.itemId);
        res.status(201).json(deletedTimeslot)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;