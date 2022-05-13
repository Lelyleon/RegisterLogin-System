const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const expressEjsLayout = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
//const path = require("path");

require("./config/passport") (passport)

//mongoose
mongoose.connect("mongodb://localhost/test", {useNewUrlParser : true, useUnifiedTopology : true})
.then(() => console.log("connected")).catch((err) => console.log(err));

//EJS
app.set("view engine", "ejs");
app.use(expressEjsLayout);
//app.set("views", path.join(__dirname, "views"));

//BodyParser
app.use(express.urlencoded({extended : false}));
app.use(session ({
    secret : "secret",
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(3000);