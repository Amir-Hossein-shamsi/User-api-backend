const express =require("express");
const multer=require('multer');
const sharp =require('sharp');
const User=require('../models/user');
const auth=require('../middleware/auth');
const router=new express.Router();




router.post('/register',async (req,res)=>{
    const user=new User(req.body);
    try {
        await user.save();
        
        const token =await user.generateAuthToken();
        res.status(201).send({user,token});

    } catch (error) {
        res.status(400).send(error);
    }

});

router.post('/users/login',async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token =await user.generateAuthToken();
        res.send({user,token});

    } catch (error) {
        res.status(400).send(error);

    }
});
router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token;
        });
        await req.user.save();
        res.send('logout');

    } catch (error) {
        res.status(500).send(error);
    }
});
router.post('/AmirHossein',auth,async (req,res)=>{
    try {
        req.user.tokens=[];
        await req.user.save();
        res.send('all of tokens deleted');

    } catch (e) {
        res.status(500).send({error:"something is  wrong please check it  ",messege:e});
    }
});
router.get('/profile',auth,async (req,res)=>{
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send({error:"somethis is going on wrong please check it  ",messege:e});
    }
});

router.patch('/edite/me',auth,async(req,res)=>{

    const array_keys=Object.keys(req.body);
    const allowedKeys=['name','email','password'];
    const valid_keys=array_keys.every((key)=>{
       return allowedKeys.includes(key);

    });
    if (!valid_keys){
        console.log(valid_keys);
        return res.status(400).send({error:'invalid update'});
    }
            
    try {
        array_keys.forEach((update)=>{
            req.user[update]=req.body[update];

        });
        await req.user.save();
        res.status(202).send(req.user);

    } catch (error) {
        return  res.status(400).send(error);

    }

});


router.delete('/users/delete',auth,async (req,res)=>{
    try {
        req.user.remove();
        
        res.status(202).send("this user was deleted");
    } catch (error) {
        res.status(500).send({messege:"something is wrong ", error:error});
    }
});



const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an avatar with jpg, jpeg or png format '));
        }
        cb(undefined,true);

    }
});

router.post ('/users/profile/avatar',auth, upload.single('avatar'),async (req,res)=>{
    
    const buffer= await sharp (req.file.buffer).resize({width:250 ,height:250 }).png().toBuffer();
    req.user.avatar=buffer;
    await req.user.save();
    res.send('avatar was added!');

},(error,res)=>{
    res.status(400).send({error:error.messege});
});
router.delete('/users/profile/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send("your avatar was deleted!");

});

router.all('/*',(req,res)=>{
    res.send(404);
});

module.exports = router;
