if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./Routes/listing.js");
const reviewsRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

const { readSync } = require("fs");

const DB_URL = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(DB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: DB_URL,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SECRET, 
  }
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionconfig = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
  }
};


app.use(session(sessionconfig)); //this will generate the cookies connect.sid
app.use(flash()); // Initialize flash messages

//put this after the session middleware because passport needs the session to be initialized
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy for authentication

passport.serializeUser(User.serializeUser()); // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // Make the current user available in all views
  next();
});



app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});


app.use("/listings" , listingsRouter); // Use the listings router for all /listings routes
app.use("/listings/:id/reviews", reviewsRouter); // Use the review router for all /listings/:id/reviews routes
app.use("/", userRouter); // Use the user router for all /users routes

// Fallback route for all non-existent endpoints
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { err });
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
