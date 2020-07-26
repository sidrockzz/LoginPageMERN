const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//set up express

const app = express();
//middleware json bodyparser reads objects from requests
app.use(express.json());
app.use(cors());
//Grabs port assigned to you.
const PORT = process.env.PORT || 5000;

//Setting up server port
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`))

//Set up mongoose

mongoose.connect(process.env.MONGODB_CONNECTION_STRING,
    {useNewUrlParser:true,
        useUnifiedTopology:true
    }, (err)=> {
    if(err) throw err;
    console.log("MongoDB connection established")
    });

//set up routes

app.use("/users", require("./routes/userRouter"));