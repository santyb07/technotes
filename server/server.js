import express from "express"
import path from "path"
import { logger } from "./middleware/logger.js";
// import root from "./routes/root.js"

const app = express()
const PORT= process.env.PORT || 8000;

app.use(logger)

app.use(express.json())

// app.use('/',root);



app.listen(PORT,()=>{
    console.log('listening form the port',PORT);
})