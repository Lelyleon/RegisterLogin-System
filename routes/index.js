const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth.js")

//login page
router.get("/", (req, res) => {
    res.render("Welcome")
});

router.get("/views/login.ejs", (req, res) => {
    res.render("login");
});

//register page
router.get("/views/register.ejs", (req, res) => {
    res.render("register")
});

router.get("/views/dashboard.ejs", ensureAuthenticated, (req, res) => {
    console.log(req);
    res.render("dashboard", {
        user: req.user
    });
});

module.exports = router;