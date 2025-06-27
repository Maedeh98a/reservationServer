const router = require("express").Router();
const doctorModel = require("../models/Doctor.model");
const patientModel = require("../models/Patient.model");
const userModel = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

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

module.exports = router;