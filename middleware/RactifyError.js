const { validationResult } = require("express-validator");
const { ErrorHandler } = require("../services/ResponseServices");

const RactifyError=(req,res,next)=>{
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return ErrorHandler(res,error.array()[0].msg); 
        } else {
            next(); 
        }
    }


module.exports={
    RactifyError
}
