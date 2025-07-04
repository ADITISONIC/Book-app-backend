import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

const router = express.Router()

const generateToken = (userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'15d'})
}

router.post("/login",async (req,res)=>{
    console.log("login")
    try {
        const {email,password} = req.body
        if(!email||!password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({
                message:"User does not exist"
            })
        }
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) return res.status(400).json({
            message:"Invalid credentials"
        })
        const token = generateToken(user._id)
        res.status(200).json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
          },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
          message: "Internal server error",
        });
    }
})

router.post("/register", async (req, res) => {
    console.log("✅ Reached /register route");
    console.log("📦 Body received:", req.body);
  try {
    const {email,username,password} = req.body
    if(!username||!email||!password){
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    if(password.length<6){
        return res.status(400).json({
            message:"Password must atleast be 6 characters long"
        })
    }
    if (username.length < 3) {
      return res.status(400).json({
        message: "username must atleast be 3 characters long",
      });
    }
    console.log("🔍 Checking for existing user...");
   const existingUser =  await User.findOne({$or:[{email},{username}]})
   if(existingUser){
    return res.status(400).json({
        message:"User already exists"
    })
   }
   const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
   const user = new User({
    email,username,password,profileImage
   })
   console.log("💾 Saving user...");
   await user.save()
   const token = generateToken(user._id)
   console.log("✅ Registration successful");
   res.status(201).json({
    token,
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        profileImage:user.profileImage
    }
   })
  } catch (error) {
    console.log(error)
    res.status(500).json({
        message:"Internal server error"
    })
  }
});


export default router