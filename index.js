const express = require('express');
const port = 4000;
const dotenv = require('dotenv')
const app = express();
const authRoute = require('./auth')
const postRoute =  require('./posts')

const mongoose = require('mongoose');
dotenv.config();


mongoose.connect( process.env.MONGODB_URL,{useNewUrlParser: true, useCreateIndex:true},
   ()=>console.log('we are connected to Db'))

app.use(express.json());

   // Routes middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute ) 
app.listen(port, ()=>{
 console.log(`Server is up at port ${port}`)
})