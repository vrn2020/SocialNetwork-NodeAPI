const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan  = require("morgan");
const dotenv = require("dotenv");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const cors = require("cors");

dotenv.config();

mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser:true,  useUnifiedTopology: true }
     
).then(() => console.log("DB connected"));

mongoose.connection.on("error", err => {
    console.log(`DB connection error:${err.message}`);
});

// bring in routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

app.get('/api', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});
app.use(cors());
app.use("/",postRoutes);
app.use("/",authRoutes);
app.use("/",userRoutes);

app.use(function(err,req,res,next){
    if(err.name ==='UnauthorizedError'){
        res.status(401).json({error:"Unauthorized"});
    }
})



const port =  8080;

app.listen(port,() => {
    console.log(`A Node JS API is listening on port ${port}`);
})