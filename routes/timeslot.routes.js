const router = require("express").Router();
const doctorModel = require("../models/Doctor.model");
const patientModel = require("../models/Patient.model");
const userModel = require("../models/User.model");
const timeSlotModel = require("../models/TimeSlot.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");



router.post("/availability", isAuthenticated, async (req, res)=>{
    try {
        const doctorId = req.payload.doctorId;
        const {date, start, end} =req.body;
        const newSlot = await timeSlotModel.create({
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

router.get("/availability/:doctorId", async (req, res)=>{
    try {
        const doctorAvailabilities = await timeSlotModel.find({doctor: req.params.doctorId});
         res.status(200).json(doctorAvailabilities);

    } catch (error) {
        console.log(error);
    }
})

router.put("/updateTimeslot/:itemId", isAuthenticated, async(req, res)=>{
    try {
        const updatedTimeslot = await timeSlotModel.findByIdAndUpdate(req.params.itemId, {
            date: req.body.date,
            start: req.body.start,
            end: req.body.end
        }, {new:true});
        res.status(200).json(updatedTimeslot);
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/:timeslotId/reserve", isAuthenticated, async (req, res)=>{
    try {
        const timeslotId = req.params.timeslotId;
        const userId = req.payload._id;
        const patient = await patientModel.findOne({user: userId});
        const patientId = patient._id
        
        if (!patientId) {
        return res.status(403).json({ message: "Only patients can book time slots" });
    }
    const timeslot = await timeSlotModel.findById(timeslotId);
    if (!timeslot) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    if (timeslot.isBooked) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }
    timeslot.bookedBy = patientId;
    timeslot.isBooked = true
    await timeslot.save();

    await patientModel.findByIdAndUpdate(patientId,{
        $push:{reservation: timeslot._id}
    })

    res.status(201).json("timeslot successfully reserved")
    } catch (error) {
        console.log(error)
    }
})
router.delete("/deleteTimeslot/:itemId", isAuthenticated , async(req, res)=>{
    try {
        const deletedTimeslot = await timeSlotModel.findByIdAndDelete(req.params.itemId);
        res.status(201).json(deletedTimeslot)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;