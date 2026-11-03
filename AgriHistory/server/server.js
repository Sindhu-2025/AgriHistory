const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const express=require("express");const mongoose=require("mongoose");const cors=require("cors");const path=require("path");
const app=express();app.use(cors({origin:(origin,cb)=>cb(null,!origin||/^http:\/\/localhost:\d+$/.test(origin)||origin===process.env.CLIENT_URL)}));app.use(express.json({limit:"2mb"}));app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.get("/",(req,res)=>res.json({success:true,message:"AgriHistory API is running"}));
app.use("/api/auth",require("./routes/authRoutes"));app.use("/api/records",require("./routes/recordRoutes"));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({success:false,message:"Server error"})});
const PORT=process.env.PORT||5000;
if(!process.env.MONGO_URI||!process.env.JWT_SECRET){console.error("Set MONGO_URI and JWT_SECRET in server/.env");process.exit(1)}
mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("MongoDB Atlas connected successfully!");app.listen(PORT,()=>console.log(`AgriHistory server running on port ${PORT}`))}).catch(e=>{console.error("MongoDB connection failed:",e.message);process.exit(1)});
