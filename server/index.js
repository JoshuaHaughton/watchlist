const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { authenticateToken, returnToken } = require("./helpers/token-helpers");
require("dotenv").config();

const uri =
  "mongodb+srv://user:Password@cluster0.b4wso.mongodb.net/Cluster0?retryWrites=true&w=majority";
const app = express();
app.use(morgan("dev"));
//Allows for server to receive requests from specific domains
app.use(cors({ credentials: true, origin: "https://watchlist-client.netlify.app" }));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "https://watchlist-client.netlify.app");
  res.header("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();  
}); 

const PORT = process.env.PORT || 3001;


app.get('/', (req, res) => {
  return res.send('Hello world!');
})

//Attempt to register a user
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, username, password } = req.body;

  //Generates unique user ids
  const generatedUserId = uuidv4();

  //Hash password for user security
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    //Connect to MongoDB database
    await client.connect();
    const database = client.db("app-data");

    //Check if user exists
    const users = database.collection("users");
    const existingUser = await users.findOne({ email });

    //Return error if email is already in use
    if (existingUser) {
      console.log("here");
      return res
        .status(409)
        .send(
          "User already exists! Please Login or Sign Up with another email.",
        );
    }

    //If no error, create user

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      username,
      hashed_password: hashedPassword,
      watchlist: [],
    };

    //Insert user into database
    await users.insertOne(data);

    //Generate JWT token from generated user ID and store it in an httpOnly cookie
    returnToken(generatedUserId, 200, res);

    // userId: generatedUserId,
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});



//Attempt to log a user in
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    //Connect to MongoDB
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    //Attempt to retrieve user info from db by given email
    const user = await users.findOne({ email });

    //Compare given password with the storeed hashed password using bcrypt
    const passwordMatch = bcrypt.compare(password, user.hashed_password);

    //If credentials are invalid, let user know
    if (!user || !passwordMatch) {
      return res.status(400).send("Invalid Credentials");
    }

    //Else, generate a token and return data to client
    returnToken(user.user_id, 200, res);

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});




//Log a user out
app.get("/logout", async (req, res) => {
  //Clear cookie if it exists
  res.status(201).clearCookie("watchlist-jwt").send("cookie deleted");
});




//Add item to user's watchlist
app.put("/my-list", authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
  //Get user ID stored in JWT token
  const userId = req.userId.userId;
  const { title, id, category, poster_path, backdrop_path, rating, year } =
    req.body;

  //Format a new watchlist item
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
    liked: false,
  };

  try {
    //Connect to MongoDB database
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const user = await users.findOne({ user_id: userId });

    //Check if item already exists in wathlist
    const foundItem = user.watchlist.find((item) => item.tmdb_id === id);

    //If item already exists, dont add it
    if (foundItem !== undefined) {
      throw new Error("item already exists!");
    }

    //Add item to watchlist

    const filter = { user_id: userId };

    const updateDoc = {
      $addToSet: {
        watchlist: newWatchlistItem,
      },
    };

    await users.updateOne(filter, updateDoc);

    res.status(201).send("Added!");

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});




// Get my watchlist
app.get("/my-list", authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
  //Get user ID stored in JWT token
  const userId = req.userId.userId;

  try {
    //Connect to MongoDB database
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ user_id: userId });

    //Return user's watchlist
    return res.status(201).json(user.watchlist);

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});




//Update user rating on a watchlist item
app.put("/user-rating", authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
  //Get user ID stored in JWT token
  const userId = req.userId.userId;
  const { frontendRating, mediaId } = req.body;

  try {
    //Connect to MongoDB database
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    //Attempt to retrieve user info from db by id
    const user = await users.findOne({ user_id: userId });

    const userWatchlist = user.watchlist;


    //Retrieve watchlist item
    const selectedWatchlistItemIndex = userWatchlist.findIndex(
      (item) => item.tmdb_id === mediaId,
    );

    const selectedWatchlistItem = userWatchlist[selectedWatchlistItemIndex];

    //Update rating on watchlist item
    const updatedWatchlistItem = {
      ...selectedWatchlistItem,
      my_rating: frontendRating,
    };

    //Update watchlist with updated item

    const updatedWatchlist = [...userWatchlist];

    updatedWatchlist[selectedWatchlistItemIndex] = updatedWatchlistItem;

    const filter = { user_id: userId };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist,
      },
    };

    await users.updateOne(filter, updateDoc);

    return res.status(201).json(updatedWatchlist);

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});




//Update "watched" boolean on watchlist item
app.put("/user-watched", authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
  //Get user ID stored in JWT token
  const userId = req.userId.userId;
  const { frontendWatched, mediaId } = req.body;

  try {
    //Connect to MongoDB database
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    //Attempt to retrieve user info from db by user ID
    const user = await users.findOne({ user_id: userId });

    const userWatchlist = user.watchlist;

    //Retrieve watchlist Item
    const selectedWatchlistItemIndex = userWatchlist.findIndex(
      (item) => item.tmdb_id === mediaId,
    );

    const selectedWatchlistItem = userWatchlist[selectedWatchlistItemIndex];

    //Update watchlist item 
    const updatedWatchlistItem = {
      ...selectedWatchlistItem,
      watched: frontendWatched,
    };

    const updatedWatchlist = [...userWatchlist];
    updatedWatchlist[selectedWatchlistItemIndex] = updatedWatchlistItem;

    const filter = { user_id: userId };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist,
      },
    };

    await users.updateOne(filter, updateDoc);

    return res.status(201).json(updatedWatchlist);

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});



//Update "liked" boolean on watchlist item
app.put("/user-liked", authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
  //Get user ID stored in JWT token
  const userId = req.userId.userId;
  const { frontendLike, mediaId } = req.body;

  try {
    //Connect to MongoDB database
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    //Attempt to retrieve user info from db by user ID
    const user = await users.findOne({ user_id: userId });

    const userWatchlist = user.watchlist;

    //Retrieve watchlist item
    const selectedWatchlistItemIndex = userWatchlist.findIndex(
      (item) => item.tmdb_id === mediaId,
    );

    const selectedWatchlistItem = userWatchlist[selectedWatchlistItemIndex];


    //Update watchlist item
    const updatedWatchlistItem = {
      ...selectedWatchlistItem,
      liked: frontendLike,
    };

    const updatedWatchlist = [...userWatchlist];

    updatedWatchlist[selectedWatchlistItemIndex] = updatedWatchlistItem;

    const filter = { user_id: userId };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist,
      },
    };

    await users.updateOne(filter, updateDoc);

    return res.status(201).json(updatedWatchlist);

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});



//Attempt to delete a watchlist item
app.put("/delete-item", authenticateToken, async (req, res) => {
  const client = new MongoClient(uri);
  //Get user ID stored in JWT token
  const userId = req.userId.userId;
  const { mediaId } = req.body;

  try {
    //Connect to MongoDB database
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    //Attempt to retrieve user info from db by email
    const user = await users.findOne({ user_id: userId });

    const userWatchlist = user.watchlist;

    //Filter watchlist to not include the watchlist item anymore
    const updatedWatchlist = userWatchlist.filter((item) => {
      return item.tmdb_id !== mediaId;
    });

    const filter = { user_id: userId };

    const updateDoc = {
      $set: {
        watchlist: updatedWatchlist,
      },
    };

    await users.updateOne(filter, updateDoc);

    return res.status(201).json(updatedWatchlist);

  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});



//Check if user httpOnly cookie is still valid
app.get("/logged", authenticateToken, async (req, res) => {
  return res.status(201).send("Auth passed, user logged in!");
});



app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
