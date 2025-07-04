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
        const {specialty, address, startedYear, userUpdates} = req.body;
        const updatedDoctor = await doctorModel.findByIdAndUpdate(doctorId, {specialty, address, startedYear}, {new: true});
        let updatedUser = null
        if(userUpdates){
            updatedUser = await userModel.findByIdAndUpdate(updatedDoctor.user, userUpdates, {new: true})
        }
        res.status(201).json({
            doctor: updatedDoctor,
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
    }
})
router.delete("/deleteDoctor", isAuthenticated, async(req, res)=>{
    try {
        const doctorId = req.payload.doctorId;
        const doctor = await doctorModel.findById(doctorId);
        if(!doctor){
            res.status(400).json({message: "Doctor not found"})
        }
        const userId = doctor.user;
         await doctorModel.findByIdAndDelete(doctorId);
         await userModel.findByIdAndDelete(userId);
        res.status(201).json({message: "Doctor and user deleted successfully"});
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


router.post('/createPatient/:userId', async (req, res)=>{
    try {
       const {userId} = req.params
       const patientInfo = await patientModel.create({...req.body, user: userId});
       res.status(201).json(patientInfo); 
    } catch (error) {
        res.status(400).json(error);
    }
})

router.get('/patient/:patientId', async (req, res)=>{
    try {
        const patientFound = await patientModel.findById(req.params.patientId).populate('user').populate({
            path: 'reservation', populate:{
                path: 'doctor',
                model: 'DoctorProfile'
            }
        });
        res.status(200).json(patientFound)

    } catch (error) {
        res.status(400).json(error);
    }
   
})
router.put('/updatePatient', isAuthenticated, async (req, res)=>{
    try {
        const patientId = req.payload.patientId
        const {dateOfBirth, history, userUpdates} = req.body;
        const updatedPatient = await patientModel.findByIdAndUpdate(patientId, {dateOfBirth, history}, {new:true});
        let updatedUser = null
        if(userUpdates){
             updatedUser = await userModel.findByIdAndUpdate(updatedPatient.user, userUpdates, {new:true})
        }
        res.status(201).json({
            patient: updatedPatient,
            user: updatedUser,
        });
    } catch (error) {
        res.status(400).json(error);
    }
})


router.delete("/deletePatient", isAuthenticated, async(req, res)=>{
    try {
        const patientId = req.payload.patientId;
        const patient = await patientModel.findById(patientId);
        if(!patient){
            res.status(400).json({message: "Patient not found"})
        }
        const userId = patient.user;
         await patientModel.findByIdAndDelete(patientId);
         await userModel.findByIdAndDelete(userId);
        res.status(201).json({message: "Patient and user deleted successfully"});
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;