import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

const app = express();
dotenv.config()


//middelwares
const corsOptions = {
    origin: '*',
    credentials:true,
    optionsSuccessStatus: 200 
  }

app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({limit: "100mb", extended: true}))
app.use(express.urlencoded({limit: "100mb", extended: true, parameterLimit: 50000}))
app.use(cookieParser())


//routes
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import blogRoute from "./routes/blogRoute.js";
import contactRoute from "./routes/contactRoute.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";
import staffRoute from "./routes/editUI/staffRoute.js"

app.use("/", cors(corsOptions), registerRoute);
app.use("/", cors(corsOptions), loginRoute);
app.use("/", cors(corsOptions), blogRoute);
app.use("/", cors(corsOptions), contactRoute);
app.use("/", cors(corsOptions), subscriptionRoute);
app.use("/", cors(corsOptions), staffRoute);


//Server and database connection
const port = process.env.PORT_NUMBER || 5000;

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true});
mongoose.connection.once("open", ()=>{
    console.log("connected to Mongo DB");
    app.listen(port, ()=>{
        console.log(`The server is running on ${port}`);
    })
})