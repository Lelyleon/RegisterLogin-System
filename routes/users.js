const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

//login handle
router.get("/views/login.ejs", (req, res) => {
    res.render("login");
});

router.get("/views/register.ejs", (req, res) => {
    res.render("register")
});

//register handle
router.post("/views/register.ejs", (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    console.log ("Name " + name + "Email: " + email + "pass: " + password);
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"});
    }
    if(password !== password2){
        errors.push({msg : "Passwords don't match"});
    }
    if(password.length < 6) {
        errors.push({msg : "Password must be at least 6 characters"});
    }
    if(errors.length > 0) {
        res.render("register", {
            errors : errors,
            name : name,
            email : email,
            password : password,
            password2 : password2
        })
    } 
    else {
        User.findOne({email : email}).exec((err, user) => {
            console.log(user);
            if(user) {
                errors.push({msg : "Email is already registered"});
                render(res , errors, name, email, password, password2);
            }
            else {
                const newUser = new User({
                    name : name,
                    email : email,
                    password : password
                });

                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt,
                    (err, hash) => {
                        if(err) throw err;
                            newUser.password = hash;
                        newUser.save().then((value) => {
                            console.log(value)
                            req.flash("success_msg", "You are now registered!")
                            res.redirect("/views/login.ejs");
                        })
                        .catch(value => console.log(value));
                    })
                );
            }
        })
    }
});

router.post("/views/login.ejs", (req, res, next) => {
    passport.authenticate('local',{
        successRedirect : '/views/dashboard.ejs',
        failureRedirect : '/views/login.ejs',
        failureFlash : true,
    })(req,res,next);
    
});

//logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/login');
});

module.exports = router;