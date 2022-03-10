const jwt = require("jsonwebtoken");

//Authenticate user using httpOnly cookie sent in header
const authenticateToken = async (req, res, next) => {

  try {

    const token = req.headers.cookie.split("=")[1];

    //Return error if they have no token
    if (!token) {
      return res.status(401).send("Token required for access! Please login.");
    }

    //Attempt to verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, userId) => {
      //If token is invalid or expired, return
      if (err) return res.status(403).send("Unauthorized Access token!");

      //If no error, set decrypt user ID and set on request object for the next middleware function
      req.userId = userId;

      //Token is authenticated, proceed with next middleware function
      next();
    });
  } catch (err) {
    //If any error is thrown, send user an error and clear the cookie if it exists
    res
      .status(500)
      .clearCookie("watchlist-jwt")
      .send("Invalid token received! Please Login again");
  }
};


//Generate JWT token from generated user ID and store it in an httpOnly cookie
const returnToken = (userId, statusCode, res) => {
  //Create JWT token using generated user ID and JWT Secret
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  //Config for httpOnly cookie
  const options = {
    httpOnly: true,
    expires: new Date(new Date().getTime() + 60 * 60 * 1000),
    sameSite: "none",
    secure: true
  };

  //Set cookie
  res
    .status(statusCode)
    .cookie("watchlist-jwt", token, options)
    .send("cookie initialized");
};

module.exports = { authenticateToken, returnToken };