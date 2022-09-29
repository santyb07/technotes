import express from "express"
import path from "path"


const app = express()
const PORT= process.env.PORT || 8000;


app.listen(PORT,()=>{
    console.log('listening form the port',PORT);
})