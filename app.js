var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var app = express();
var port = process.env.PORT || 8080;

var passport = require("passport");
var flash = require("connect-flash");

require("./config/passport")(passport);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.set("view engine", "ejs");

app.use(
	session({
		secret: "justasecret",
		resave: true,
		saveUninitialized: true
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./routes/index.js")(app, passport);

app.listen(port);
console.log("Port: " + port);

app.use(express.static(__dirname + "/public"));
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
