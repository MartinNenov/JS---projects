require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error',(err)=> console.log(err));
db.once('open',()=>console.log('Connected to DB'));

app.use(express.json());

const newsRouter = require('./routes/news');
app.use('/news',newsRouter);

// ROUTES

app.get('/',(req,res)=>{
    res.send('Its working');
})

// Start listening to the server


let port = 3000;
app.listen(port,()=>{
    console.log(`Server listening on port:${port}`);
});
