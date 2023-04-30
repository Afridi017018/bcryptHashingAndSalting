const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
require("dotenv").config();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require("./model/user.model")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected db!!!")
    }).catch((err) => {
        console.log(err);
    })


//for home
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})



//for registration
app.post('/reg', async (req, res) => {

    const name = req.body.name;
    const pass = req.body.pass;

     console.log(pass)

    try {

        bcrypt.hash(pass, saltRounds, async (err, hash) => {

            if (err)
                res.send(err)

            const newUser = new User({
                name,
                pass: hash
            });

            const data = await newUser.save();

            res.status(200).json(data)
        })


    }
    catch (err) {
        res.status(500).json(err.message)
    }

})



//for login
app.post('/login', async (req, res) => {

    const { name, pass } = req.body

    try {

        const existUser = await User.findOne({ name: name })

        if (existUser) {
            bcrypt.compare(pass, existUser.pass, async (err, result) => {
                if (result === true)
                    res.status(200).json({ status: "valid user" })
                else
                    res.status(200).json({ status: "wrong password" })

            })
        }


        else
            res.status(200).json({ status: "user not found" })

    }
    catch (err) {
        res.status(500).json(err.message)
    }

})



module.exports = app;