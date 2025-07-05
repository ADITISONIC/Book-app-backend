import express from "express"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import connectDB from "./lib/db.js"
import cors from "cors"
import job from "./lib/cron.js"

const app = express()
const PORT = process.env.PORT

job.start()
app.use(express.json({ limit: "10mb" })); // <- Increase JSON body limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors())

app.use("/api/auth",authRoutes)
app.use("/api/books",bookRoutes)

app.listen(5010,()=>{
    console.log(`Server is running on ${PORT}`)
    connectDB();
})