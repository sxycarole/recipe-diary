var express = require("express");
var router  = express.Router();
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var { isLoggedIn, checkUserRecipe, checkUserComment, isAdmin } = middleware; // destructuring assignment

// Define escapeRegex function for search feature, escape regular expression special characters
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// INDEX - show all recipes
router.get("/", function(req, res){
  if(req.query.search && req.xhr) { // req.query contains a property for each query string parameter in the route. req.xhr = true if the request was issued by a client library such as jQuery
      const regex = new RegExp(escapeRegex(req.query.search), 'gi'); // g modifier: global. All matches (don't return on first match), i modifier: insensitive. Case insensitive match (ignores case of [a-zA-Z])
      // Get all recipes from DB
      Recipe.find({name: regex}, function(err, allRecipes){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allRecipes);
         }
      });
  } else {
      // Get all recipes from DB
      Recipe.find({}, function(err, allRecipes){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allRecipes);
            } else {
              res.render("recipes/index",{recipes: allRecipes, page: 'recipes'});
            }
         }
      });
  }
});

//CREATE - add new recipe to DB
router.post("/", isLoggedIn, function(req, res){
  // get data from form and add to recipes array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var cost = req.body.cost;
  // geocoder.geocode(req.body.location, function (err, data) {
  //   if (err || data.status === 'ZERO_RESULTS') {
  //     req.flash('error', 'Invalid address');
  //     return res.redirect('back');
  //   }
  //   var lat = data.results[0].geometry.location.lat;
  //   var lng = data.results[0].geometry.location.lng;
  //   var location = data.results[0].formatted_address;
  //   var newRecipe = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    var newRecipe = {name: name, image: image, description: desc, cost: cost, author:author};
    // Create a new recipe and save to DB
    Recipe.create(newRecipe, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to recipes page
            console.log(newlyCreated);
            res.redirect("/recipes");
        }
    });
  });
// });

//NEW - show form to create new recipe
router.get("/new", isLoggedIn, function(req, res){
   res.render("recipes/new"); 
});

// SHOW - shows more info about one recipe
router.get("/:id", function(req, res){
    //find the recipe with provided ID
    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
        if(err || !foundRecipe){
            console.log(err);
            req.flash('error', 'Sorry, that recipe does not exist!');
            return res.redirect('/recipes');
        }
        console.log(foundRecipe)
        //render show template with that recipe
        res.render("recipes/show", {recipe: foundRecipe});
    });
});

// EDIT - shows edit form for a recipe
router.get("/:id/edit", isLoggedIn, checkUserRecipe, function(req, res){
  //render edit template with that recipe
  res.render("recipes/edit", {recipe: req.recipe});
});

// PUT - updates recipe in the database
router.put("/:id", function(req, res){
  // geocoder.geocode(req.body.location, function (err, data) {
  //   var lat = data.results[0].geometry.location.lat;
  //   var lng = data.results[0].geometry.location.lng;
  //   var location = data.results[0].formatted_address;
  //   var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost};
    Recipe.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, recipe){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/recipes/" + recipe._id);
        }
    });
  });
// });

// DELETE - removes recipe and its comments from the database
router.delete("/:id", isLoggedIn, checkUserRecipe, function(req, res) {
    Comment.remove({
      _id: {
        $in: req.recipe.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.recipe.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'Recipe deleted!');
            res.redirect('/recipes');
          });
      }
    })
});

module.exports = router;

