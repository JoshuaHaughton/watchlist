const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require("dotenv").config();
const uri = "mongodb+srv://user:Password@cluster0.b4wso.mongodb.net/Cluster0?retryWrites=true&w=majority"

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json('hello')
})

app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri);

  const { email, password } = req.body


  //Generates unique user ids
  const generatedUserId = uuidv4();

  //Hash password for user security
  const hashedPassword = await bcrypt.hash(password, 10);


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const existingUser = await users.findOne({ email })

    //Return error if email is already in use
    if(existingUser) {
      console.log('here')
      return res.status(409).send('User already exists. Please login or Sign Up with another email')
    }

    //If no error, create user
    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword
    }

    const insertedUser = await users.insertOne(data)
    console.log('inserted', insertedUser)

    const token = jwt.sign({user: insertedUser.insertedId}, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail })

  } catch(err) {
    console.log(err)
  }

})

//FOR TESTING, WILL BE REMOVED
app.get('/users', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    //Connect to MongoDB
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const returnedUsers = await users.find().toArray();

    console.log(returnedUsers)
    //Return all users
    res.send(returnedUsers)


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }

})


app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))