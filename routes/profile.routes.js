const router = require("express").Router();
const doctorModel = require("../models/Doctor.model");
const patientModel = require("../models/Patient.model");
const userModel = require("../models/User.model");
const timeSlot = require("../models/TimeSlot.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");



router.get("/doctors", async(req, res)=>{
    try {
        const allDoctors = await doctorModel.find().populate('user');
        res.status(200).json(allDoctors);
    
    } catch (error) {
        console.log("this",error);
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

router.post('/createDoctor/:userId', async (req, res)=>{
    try {
        const {userId} = req.params;
        const doctorInfo = await doctorModel.create({...req.body, user: userId});
        res.status(201).json(doctorInfo)

    } catch (error) {
        res.status(400).json(error);
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

router.get("/:userId", async (req, res)=>{
    try {
        const userFound = await userModel.findById(req.params.userId);
        res.status(200).json(userFound);
    } catch (error) {
        res.status(400).json(error);
    }
})

router.put("/updateUser", isAuthenticated, async (req, res)=>{
    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.userId, req.body, {new: true});
        res.status(200).json(updatedUser);        
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

router.post('/createPatient/:userId', isAuthenticated, async (req, res)=>{
    try {
       const {userId} = req.params
       const patientInfo = await patientModel.create({...req.body, user: userId});
       res.status(201).json(patientInfo); 
    } catch (error) {
        res.status(400).json(error);
    }
})

router.put('/updatePatient', isAuthenticated, async (req, res)=>{
    try {
        const patientId = req.payload.patientId
        const updatedPatient = await patientModel.findByIdAndUpdate(patientId, req.body, {new:true});
        res.status(201).json(updatedPatient);
    } catch (error) {
        res.status(400).json(error);
    }
})

module.exports = router;