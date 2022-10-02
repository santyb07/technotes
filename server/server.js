import dotenv from "dotenv"
import express from "express"
import path from "path"
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
// import root from "./routes/root.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";
import {connectDB} from "./config/dbConn.js"
import {logEvents} from "./middleware/logger.js"
import mongoose from "mongoose";

dotenv.config();

const app = express()
const PORT= process.env.PORT || 8000;

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

// app.use('/',root);

app.use(errorHandler)

mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDb')
    app.listen(PORT,()=>{
        console.log('listening form the port',PORT);
    })
})

mongoose.connection.on('error',err=>{
    console.log(err);
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log')
})
