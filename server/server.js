const dotenv = require("dotenv")
const express = require("express")
const path = require('path')
const errorHandler = require("./middleware/errorHandler")
const root = require("./routes/root")
const userRoutes = require("./routes/userRoutes")
const noteRoutes = require("./routes/noteRoutes")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const connectDB = require("./config/dbConn")
const { logger, logEvents } = require('./middleware/logger')
const mongoose = require("mongoose")


dotenv.config();

const app = express()
const PORT= process.env.PORT || 8000;

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/',root);
app.use('/auth',require('./routes/authRoutes'))
app.use('/users',userRoutes)
app.use('/notes',noteRoutes)

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