const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth=async (req,res,next)=> {
    try {
        const token=req.header('Authorization').replace('Bearer ','');
        const decodedToken =await jwt.verify(token,'thisismyUserAPIproject');
        const findUser=await User.findOne({_id:decodedToken._id,'tokens.token': token});
    
        if (!findUser) {
            throw new Error();
        }
        req.token=token ;
        req.user=findUser;
        next();
        
    } catch (e) {
        res.status(401).send({error:'please authenticate. '});
    }

};
module.exports=auth;