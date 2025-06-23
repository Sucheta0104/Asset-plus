const express =  require('express');
const app = express();

require('dotenv').config();
const connectDB = require('./config/db'); 
const port = process.env.PORT || 5000;
connectDB();

app.get('/',(req,res)=>{
    res.send("hello world")
})
app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})
