const router = require("express").Router();
const doctorModel = require("../models/Doctor.model");
const patientModel = require("../models/Patient.model");
const userModel = require("../models/User.model");
const timeSlot = require("../models/TimeSlot.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { act } = require("react");

router.get("/:userId", async (req, res)=>{
    try {
        const userFound = await userModel.findById(req.params.userId);
        res.status(200).json(userFound);
    } catch (error) {
        res.status(400).json(error);
    }
})

router.get('/doctor/:doctorId', async (req, res)=>{
    try {
        const doctorFound = await doctorModel.findById(req.params.doctorId).populate('user');
        res.status(200).json(doctorFound)

    } catch (error) {
        res.status(400).json(error);
    }
   
})


router.get('/patient/:patientId', async (req, res)=>{
    try {
        const patientFound = await patientModel.findById(req.params.patientId).populate('user');
        res.status(200).json(patientFound)

    } catch (error) {
        res.status(400).json(error);
    }
   
})
router.post('/createDoctor', isAuthenticated, async (req, res)=>{
    try {
       
        const doctorInfo = await doctorModel.create(req.body);
        res.status(201).json(doctorInfo)

    } catch (error) {
        res.status(400).json(error);
    }
   
})

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

router.put("/updateDoctor", isAuthenticated, async (req, res)=>{
    try {
        const doctorId = req.payload.doctorId;
        const updatedProfile = await doctorModel.findByIdAndUpdate(doctorId, req.body, {new: true});
        res.status(201).json(updatedProfile);
    } catch (error) {
        console.log(error);
    }
})
router.delete("/deleteDoctor", isAuthenticated, async(req, res)=>{
    try {
        const doctorId = req.payload.doctorId;
        const deletedDoctor = await doctorModel.findByIdAndDelete(doctorId);
        res.status(201).json(deletedDoctor);
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;