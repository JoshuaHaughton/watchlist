const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
require("dotenv").config();
const uri = "mongodb+srv://user:Password@cluster0.b4wso.mongodb.net/Cluster0?retryWrites=true&w=majority"
const app = express();
app.use(morgan('dev'))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 3001;


const authenticateToken = async (req, res, next) => {

  try {

    console.log(req.headers.cookie, 'req.headers.cookie')

    const token = req.headers.cookie.split('=')[1];


    //Return if they have no token
    if (!token) return res.status(401).send('Token required for access! Please login.')

    jwt.verify(token, process.env.JWT_SECRET, (err, userId) => {
    //They have a token, but it has expired so they no longer have access
    if (err) return res.status(403).send("Unauthorized Access token!")

    //Set user on request object
    req.userId = userId;

    //Token is authenticated, proceed with route
    next()
  })

  } catch(err) {
    // console.log(err, 'authenticate')
    res.status(500)
    .clearCookie('watchlist-jwt')
    .send("Invalid token received! Please Login again")
    

    
  }

  
}




const returnToken = (userId, statusCode, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
  const options = {
    httpOnly: true, 
    expires: new Date(new Date().getTime() + (60 * 60 * 1000)), 
    sameSite: 'strict',
    path: "/"
  }


  console.log('jwt token for:', userId)
  // console.log(process.env.JWT_EXPIRY)
  // console.log(Number(process.env.JWT_EXPIRY))

  // userId: user.user_id,
  res.status(statusCode)
  .cookie('watchlist-jwt', token, options)
  .send('cookie initialized')
}







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


    returnToken(generatedUserId, 200, res);

    // userId: generatedUserId,


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

    returnToken(user.user_id, 200, res);


  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }

})

app.get('/logout', async(req, res) => {

      res.status(201)
      .clearCookie('watchlist-jwt')
      .send('cookie deleted')

})

app.put('/my-list', authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
  console.log('my list')

  const userId = req.userId.userId;

  const { title, id, category, poster_path, backdrop_path, rating, year } = req.body
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
    const user = await users.findOne({user_id: userId})
    console.log('USER', user)
    const foundItem = user.watchlist.find(item => item.tmdb_id === id)

    // If item already exists, dont add it
    if(foundItem !== undefined) {
      throw new Error("item already exists!")
    }

    const filter = { user_id: userId };

    const updateDoc = {
      $addToSet: {
        watchlist: newWatchlistItem
      },
    };

    // const options = { upsert: true };

    // console.log()

    const result = await users.updateOne(filter, updateDoc);
    console.log(result, 'added')



    res.status(201).send('Added!');

  } catch(err) {
    console.log(err)
  } finally {
    await client.close()
  }
})


// Get my watchlist
app.get('/my-list', authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
 
  console.log(req.userId, 'user id')

  const userId = req.userId.userId;


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ user_id: userId });
    console.log(user)


    return res.status(201).json(user.watchlist)


  } catch(err) {
    console.log(err)
    
  } finally {
    await client.close()
  }
})

app.put('/user-rating', authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);

  const userId = req.userId.userId;
  console.log(userId)
  console.log(req.userId, 'id')
  const { frontendRating, mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ user_id: userId });
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

    const filter = { user_id: userId };

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



app.put('/user-watched', authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);

  console.log(req.body)

  const userId = req.userId.userId;
  const { frontendWatched, mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ user_id: userId });
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

    const filter = { user_id: userId };

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




app.put('/user-liked', authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);

  console.log(req.body)

  const userId = req.userId.userId;
  const { frontendLike, mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ user_id: userId });
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

    const filter = { user_id: userId };

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



app.put('/delete-item', authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);

  console.log('body', req.body)

  const userId = req.userId.userId;
  const { mediaId } = req.body


  try {
    //Connect to MongoDB database
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ user_id: userId });
    console.log(user)

    const userWatchlist = user.watchlist;
    console.log('watchlist:', userWatchlist)


    const updatedWatchlist = userWatchlist.filter(item => {
      console.log('ids!', item.tmbd_id, mediaId)
      return item.tmdb_id !== mediaId
    })

    const filter = { user_id: userId };

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

app.get('/logged', authenticateToken, async (req, res) => {
//   const client = new MongoClient(uri);


  const userId = req.userId.userId;
  console.log(userId)
  console.log(req.userId, 'user id first')




//   try {
//     //Connect to MongoDB database
//     await client.connect()
//     const database = client.db('app-data')
//     const users = database.collection('users')

//     //Attempt to retrieve user info from db by email
//     const user = await users.findOne({ user_id: userId });
//     console.log(user)


    return res.status(201).send("Auth passed, user logged in!")


  // } catch(err) {
  //   console.log(err)
  // } finally {
  //   await client.close()
  // }
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