import jwt from "jsonwebtoken"
import User from "../models/User.js"

//const response = await fetch(`https://localhost:3000/api/books`,{
  //  method:"POST",
    //body:JSON.stringify({
      //  title,
        //caption
    //}),
    //headers:{Authorization:`Bearer ${token}`}
//})

const protectRoute = async (req,resizeBy,next)=>{
     try {
        const token = req.header("Authorization").replace("Bearer ","")
        if(!token) return res.status(401).json({
            message:"No authentication token"
        })
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(401).json({message:"Token not valid"})
        req.user= user
        next()
     } catch (error) {
        
        console.log(error)
        res.status(401).json({message:"Tojen not valid"})
     }
}
export default protectRoute