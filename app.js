// Main program
// Version 1.0.1

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Recipe  = require("./models/recipe"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
// configure dotenv: Storing configuration in the environment separate from code.
require('dotenv').load();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    recipeRoutes = require("./routes/recipes"),
    indexRoutes      = require("./routes/index")
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe_diary';

mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


// configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

//require moment
app.locals.moment = require('moment');



// ===============PASSPORT CONFIGURATION============
// The Secret phrase is used to encode and decode the session; thereby allowing encrypted data to be stored during the session
app.use(require("express-session")({
    secret: "For my dear Tim.",
    resave: false,
    saveUninitialized: false
}));

// With the flash middleware in place, all requests will have a req.flash() function that can be used for flash messages
app.use(flash());

// These two lines of code must appear AFTER THE EXPRESS-SESSION code
app.use(passport.initialize());
app.use(passport.session());

// var User = require('./models/user'); above
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===============================


// clean and initinalize the database
seedDB(); 


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

app.listen(process.env.PORT||3000, process.env.IP, function(){
   console.log("My Recipe Diary Has Started!");
});