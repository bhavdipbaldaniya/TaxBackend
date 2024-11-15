

async function ErrorHandler(res,error){
    return res.status(200).send({status:0,msg:error })
}
async function AuthErrorHandler(res,msg){
    return res.status(401).send({status:3 , msg})
}
async function ResponseOk(res,msg,data){
    return res.status(200).send({status:1,msg,data })
}



module.exports ={
    ErrorHandler,ResponseOk, AuthErrorHandler
};