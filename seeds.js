var mongoose = require("mongoose");
    User = require("./models/user");
    Recipe = require("./models/recipe");
    Comment = require("./models/comment");

var user = [
    {
        user_id: 1,
        username: "Carol",
        password: "123456"
    },
    {
        user_id: 2,
        username: "Tim",
        password: "123456"
    },
    {
        user_id: 3,
        username: "Iris",
        password: "123456"
    },
    {
        user_id: 4,
        username: "John",
        password: "123456"
    },
    {
        user_id: 5,
        username: "Rita",
        password: "123456"
    }
]

var data = [
    {
        name: "Chicken Fried Rice", 
        image: "https://lh3.googleusercontent.com/75JwIaT3_GF2zmFaOhdlumJAkkcxZzt1kPKkv-Bo9PYQUKH7aFWZkwL4qAq3HYNZQHtzpBTpoptEyOO81t0sWA=s320-c-rj-v1-e365",
        description: "1. Cook and shred the chicken. I highly recommend cooking it in a slow cooker in this teryiaki sauce. (see notes below) \n 2. Preheat a large skillet or wok to medium heat. Pour sesame oil in the bottom. Add white onion and peas and carrots and fry until tender. \n 3. Slide the onion, peas and carrots to the side, and pour the beaten eggs onto the other side. Using a spatula, scramble the eggs. Once cooked, mix the eggs with the vegetable mix. \n4. Add the rice and chicken to the veggie and egg mixture. Pour the soy sauce on top. Stir and fry the rice and veggie mixture until heated through and combined. Add chopped green onions if desired.",
        cost: 55,
        author: {
            user_id: 2,
            username: "Tim"
        }
    },
    {
        name: "Best Clam Chowder", 
        image: "https://lh3.ggpht.com/4o58dkVk3K7AVgGO-3IbI9urp3pH4ITH_83KyJh4pkH0VaMytvVxCH-0XBmjL7zi0I4H3Ij9wAzD-ety2PIv7A=s320-c-rj-v1-e365",
        description: "1. In a Dutch oven, you cook bacon (for amazing flavor!) over medium heat until crisp.\n 2. Then you saute celery, leek, and onion until tender, adding garlic. Eventually stirring in potatoes, broth, clam juice, salt, pepper and thyme.\n 3. Boil and simmer until potatoes are tender.\n 4. Make the creamy sauce (soooo good).\n 5. Stir in the clams and crispy bacon!",
        cost: 40,
        author: {
            user_id: 1,
            username: "Carol"
        }
    },
    // {
    //     name: "Canyon Floor", 
    //     image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    // }
]

function seedDB(){
    // Remove all users
   User.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed users!");
         //add a few users
        user.forEach(function(seed){
            Recipe.create(seed, function(err, newlyCreated){
                if(err){
                    console.log(err)
                } else {
                    console.log(newlyCreated);
                }
            });
        });
    }); 

   //Remove all recipes
   Recipe.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed recipes!");
         //add a few recipes
        data.forEach(function(seed){
            Recipe.create(seed, function(err, recipe){
                if(err){
                    console.log(err)
                } else {
                    //create a comment
                    // Comment.create(
                    //     {
                    //         text: "This place is great, but I wish there was internet",
                    //         author: {
                    //             user_id: 2,
                    //             username: "Tim"
                    //         }
                    //     }, function(err, comment){
                    //         if(err){
                    //             console.log(err);
                    //         } else {
                    //             recipe.comments.push(comment);
                    //             recipe.save();
                    //             console.log("Created new comment");
                    //         }
                    //     });
                    console.log(recipe);
                }
            });
        });
    }); 
}

module.exports = seedDB;
