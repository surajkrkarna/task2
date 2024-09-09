const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://surajkarna:secured@mongo1:27017,mongo2:27017/mydb?replicaSet=rs0&authSource=admin')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Mongo Connected")
})

const mySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const MyDbInstance = mongoose.model('user', mySchema);

app.listen(3000, () => console.log('running on node 3000'));

const limiterOne = rateLimiter({
    windowMs: 1000, // 1 minute
    max: 1, // Limit each IP to 20 requests per minute
    message: 'Too many requests, please try again later.',
})

const limiterTwo = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 requests per minute
    message: 'Too many requests, please try again later.',
})

app.get('/', (req, res) => {
    console.log('incoming to /')
    res.json({ name: "suraj" });
});

app.post('/registeruser', limiterOne, limiterTwo, async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new MyDbInstance({ username, password });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.log('error', error)
        res.status(500).send('Error registering user');
    }
});



