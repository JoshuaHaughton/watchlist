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
  console.log(req.body)

  const { email, username, password } = req.body


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
      return res.status(409).send('User already exists! Please Login or Sign Up with another email.')
    }

    //If no error, create user
    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      username,
      hashed_password: hashedPassword,
      watchlist: []
    }

    const insertedUser = await users.insertOne(data)
    console.log('inserted', insertedUser)

    const token = jwt.sign({user: generatedUserId}, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    // userId: generatedUserId,
    res.status(201).json({ token, username: req.body.username, sanitizedEmail })

  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }

})

app.post('/login', async(req, res) => {
  const client = new MongoClient(uri)
  const { email, password } = req.body

  try {
    //Connect to MongoDB
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ email });
    console.log('USER', user)
    const username = user.username;

    const passwordMatch = bcrypt.compare(password, user.hashed_password)

    //If credentials are invalid, let user know
    if(!user || !passwordMatch) {
      return res.status(400).send('Invalid Credentials');
    }

    //Else, generate a token and return data to client
    const token = jwt.sign({user: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    console.log('USERNAME', username)
    console.log(user)

    // userId: user.user_id,
    res.status(201).json({ token, username, email })


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }

})

app.put('/my-list', async (req, res) => {
  const client = new MongoClient(uri);
  console.log(req.body)

  const { title, id, category, email, poster_path, backdrop_path, rating, year } = req.body
  const newWatchlistItem = {
    title,
    tmdb_id: id,
    type: category,
    poster_path,
    backdrop_path,
    release_date: year,
    tmdb_rating: rating,
    my_rating: 0,
    watched: false,
    liked: false
  }


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const filter = { email };

    const updateDoc = {
      $addToSet: {
        watchlist: newWatchlistItem
      },
    };

    // const options = { upsert: true };

    console.log(filter, updateDoc)

    const result = await users.updateOne(filter, updateDoc);
    console.log(result)



    // res.status(201).json({ token, username })

  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }
})


// Get my watchlist
app.post('/my-list', async (req, res) => {
  const client = new MongoClient(uri);
  console.log(req.body)

  const { email } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ email });
    console.log(user)


    return res.status(201).json(user.watchlist)


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }
})

app.put('/user-rating', async (req, res) => {
  const client = new MongoClient(uri);

  console.log(req.body)

  const { email, frontendRating, mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ email });
    console.log(user)

    const userWatchlist = user.watchlist;
    console.log('watchlist:', userWatchlist)

    const selectedWatchlistItemIndex = userWatchlist.findIndex(item => item.tmdb_id === mediaId)
    console.log('index', selectedWatchlistItemIndex)

    const selectedWatchlistItem = userWatchlist[selectedWatchlistItemIndex]

    const updatedWatchlistItem = {...selectedWatchlistItem, my_rating: frontendRating}
    console.log("updated item", updatedWatchlistItem)

    const updatedWatchlist = [...userWatchlist]
    updatedWatchlist[selectedWatchlistItemIndex] = updatedWatchlistItem

    const filter = { email };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist
      },
    };

    // const options = { upsert: true };

    console.log(filter, updatedWatchlist, updatedWatchlistItem)

    const result = await users.updateOne(filter, updateDoc);
    console.log(result)



    return res.status(201).json(updatedWatchlist)


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }

})



app.put('/user-watched', async (req, res) => {
  const client = new MongoClient(uri);

  console.log(req.body)

  const { email, frontendWatched, mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ email });
    console.log(user)

    const userWatchlist = user.watchlist;
    console.log('watchlist:', userWatchlist)

    const selectedWatchlistItemIndex = userWatchlist.findIndex(item => item.tmdb_id === mediaId)
    console.log('index', selectedWatchlistItemIndex)

    const selectedWatchlistItem = userWatchlist[selectedWatchlistItemIndex]

    const updatedWatchlistItem = {...selectedWatchlistItem, watched: frontendWatched}
    console.log("updated item", updatedWatchlistItem)

    const updatedWatchlist = [...userWatchlist]
    updatedWatchlist[selectedWatchlistItemIndex] = updatedWatchlistItem

    const filter = { email };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist
      },
    };

    // const options = { upsert: true };

    console.log(filter, updatedWatchlist, updatedWatchlistItem)

    const result = await users.updateOne(filter, updateDoc);
    console.log(result)



    return res.status(201).json(updatedWatchlist)


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }

})




app.put('/user-liked', async (req, res) => {
  const client = new MongoClient(uri);

  console.log(req.body)

  const { email, frontendLike, mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ email });
    console.log(user)

    const userWatchlist = user.watchlist;
    console.log('watchlist:', userWatchlist)

    const selectedWatchlistItemIndex = userWatchlist.findIndex(item => item.tmdb_id === mediaId)
    console.log('index', selectedWatchlistItemIndex)

    const selectedWatchlistItem = userWatchlist[selectedWatchlistItemIndex]

    const updatedWatchlistItem = {...selectedWatchlistItem, liked: frontendLike}
    console.log("updated item", updatedWatchlistItem)

    const updatedWatchlist = [...userWatchlist]
    updatedWatchlist[selectedWatchlistItemIndex] = updatedWatchlistItem

    const filter = { email };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist
      },
    };

    // const options = { upsert: true };

    console.log(filter, updatedWatchlist, updatedWatchlistItem)

    const result = await users.updateOne(filter, updateDoc);
    console.log(result)



    return res.status(201).json(updatedWatchlist)


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }

})



app.put('/delete-item', async (req, res) => {
  const client = new MongoClient(uri);

  console.log('body', req.body)

  const { email, mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ email });
    console.log(user)

    const userWatchlist = user.watchlist;
    console.log('watchlist:', userWatchlist)


    const updatedWatchlist = userWatchlist.filter(item => {
      console.log('ids!', item.tmbd_id, mediaId)
      return item.tmdb_id !== mediaId
    })

    const filter = { email };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist
      },
    };


    console.log(filter, updatedWatchlist)

    const result = await users.updateOne(filter, updateDoc);
    console.log(result)



    return res.status(201).json(updatedWatchlist)


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
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