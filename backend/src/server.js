import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/User.routes.js"
import bidRoutes from "./routes/Bid.routes.js"
import auctionRoutes from "./routes/Auction.routes.js"
const app=express()
//initializing cors
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",//by default allows only get method and post
    credentials:true//allows cookies
}))

app.use(express.json({limit:"16kb"}))//shows the how much space is needed
app.use(express.urlencoded({extended:true,limit:"16kb"}))//used to deal with the form data
app.use(express.static("public"))
app.use(cookieParser())//recent activities

app.use("/api/v1/User",userRoutes)
app.use("/api/v1/Bid",bidRoutes)
app.use("/api/v1/Auction",auctionRoutes)





export{ app }