const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User.model");
const DoctorModel = require("../models/Doctor.model");
const PatientModel = require("../models/Patient.model")
const { isAuthenticated } = require("../middlewares/jwt.middleware");


router.post('/signup', async(req, res)=>{
    try {
        const theSalt = bcryptjs.genSaltSync(12);
        const hashedPassword = bcryptjs.hashSync(req.body.password, theSalt);
        const hashedUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body. email,
            description: req.body.description,
            password: hashedPassword,
            role: req.body.role
        }
        const createdUser = await UserModel.create(hashedUser);
        res.status(201).json(createdUser);
        
    } catch (error) {
        
        res.status(500).json(error);
        
    }
})

router.post('/login', async(req, res) => {
    try {
        const foundUser = await UserModel.findOne({email: req.body.email})
        if (!foundUser){
            res.status(400).json({errorMessage: "Email does not exist"});
        }
        else{
            const doesPasswordMatch = bcryptjs.compareSync(req.body.password, foundUser.password);
            if(!doesPasswordMatch){
                res.status(403).json({errorMessage:"Password does not match"});
            }else{
                // const doctorId = await DoctorModel.findOne({user: foundUser._id});
                // const patientId = await PatientModel.findOne({user: foundUser._id});
                const data = {_id: foundUser._id, role: foundUser.role};
                const authToken = jwt.sign(data, process.env.TOKEN_SECRET,{
                    algorithm:"HS256",
                    expiresIn:"6h"
                })
                res.status(200).json({message: "You are logged in", authToken})
            }

        }
        
    } 
    catch (error) {
         
        res.status(500).json(error);
    }
})

router.get('/verify', isAuthenticated, (req, res)=>{
    if(req.payload)
    {res.status(200).json({message:"Token valid", payload: req.payload})}
    else{
        res.status(400).json({errorMessage:"Token does not valid"})
    }
})
module.exports = router;
