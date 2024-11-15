
const { ErrorHandler, AuthErrorHandler } = require("../services/ResponseServices");


async function errorHandler(err,req,res,next){
    if (err.name==='UnauthorizedError'){
        return AuthErrorHandler(res,"Unauthorized  User")
    }
    if (err.name==='ValidationError'){
        return AuthErrorHandler(res,err)
    }
    return res.status(401).send({status:3 , msg:err})
}
module.exports = errorHandler;