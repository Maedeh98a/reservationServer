const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next){
    console.log("hello...from inside ");

    if(req.headers.authorization){
        if(req.headers.authorization.split(' ')[0] === 'Bearer'){
            const theToken = req.headers.authorization.split(' ')[1];
            try{

           
            const payload = jwt.verify(theToken, process.env.TOKEN_SECRET)
            req.payload = payload;
         next();  }catch(err){
            res.status(401).json({errorMessage:"Invalid or expired token"})

         }   
        }
        else
        {
            res.status(403).json({errorMessage: "Token malford"})
        }
       
    }
    else
    {
        res.status(403).json({errorMessage: "No token present"})
    }

}

module.exports = {isAuthenticated}