const mongoose=require('mongoose');
const validator=require('validator');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid please check it! :)');
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is not Valid please retype it :)');
            }
        }
    },
    avatar:{
        type: Buffer
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    
},{
    timestamps:true
});

userSchema.methods.toJSON=function (){
    const user= this;
    const userObject=user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;

};
userSchema.methods.generateAuthToken =  async function () {
    const user=this;
    //const _id=user._id.toString();
    const token =  jwt.sign({_id: user._id.toString()},"thisismyUserAPIproject");
    user.tokens=user.tokens.concat({token});
    console.log("user saved");
    await user.save();
    return token;

  };
  userSchema.statics.findByCredentials = async (email,password)=>{
      const user= await User.findOne({email});
      if (!user) {
          throw new Error('unable to login');
        }
        const isMatch =await bcryptjs.compare(password,user.password);
        if (!isMatch){ 
            throw new Error('Unable to login');
        }
    
      return user;

  };
  
  userSchema.pre('save',async function (next) {
      const user=this ;
      if (user.isModified('password')) {
          user.password=await bcryptjs.hash(user.password,8);

      }  
      next();

    });
const User=mongoose.model('User',userSchema);

module.exports=User;
