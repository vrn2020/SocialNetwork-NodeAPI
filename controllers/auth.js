const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();
const expressJWT = require("express-jwt");

exports.signup = async (req, res) => {
    const userExists = await User.findOne({email:req.email});
    if(userExists) return res.status(403).json({
        errpr:"Email is taken!"
    })
    const user = await new User(req.body)
    await user.save()
    res.status(200).json({message:"Signup success! Please login"});
}

exports.signin = (req, res) => {
    // find the user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err,user) => {

        // If err or no user 
        if(err || !user){
            return res.status(401).json({
                error:"user with that email does not exist. Please signin."
            })
        }
        // If user, authenticate
        // If user is found make sure the email and password match
        // create authenticate method in model auth
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "email and password do not match"
            })
        }

        // Generate a token with user id and secret
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry data. 
        res.cookie("t", token, {expire: new Date() + 9999 })
        // return response with user and token to frontend client. 
        const {_id, name, email} = user;
        // return response with user and token
        return res.json({token, user:{_id, email, name}})
    });

};

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({message: "Signout success!"})
}

exports.requireSignin = expressJWT({
    secret:process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty:"auth" 
})
