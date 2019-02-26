module.exports = function(app, passport) {
	//var express = require("express");
	//var router = express.Router();
	var writeNew = require("../config/insertNewRecord");
	var writeSub = require("../config/insertSubRecord");
	var records = require("./../config/ProfileProducts");

	// index page
	app.get("/", function(req, res, next) {
		res.render("index", { page: "Home", menuId: "home", user: req.user });
	});

	//record page
	app.get("/record", function(req, res, next) {
		res.render("record", {
			page: "Add Record",
			menuId: "record",
			user: req.user
		});
	});

	app.post("/record", function(req, res) {
		console.log(req.body);
		if (req.body.subVersion == "") {
			writeNew.write(req).then(function() {
				res.redirect("/profile");
			});
		} else if (req.body.subVersion != "") {
			writeSub.write(req).then(function() {
				res.redirect("/profile");
			});
		}
	});

	// login page
	app.get("/login", function(req, res, next) {
		res.render("login", {
			page: "Login",
			menuId: "login",
			message: req.flash("loginMessage"),
			user: req.user
		});
	});

	app.post(
		"/login",
		passport.authenticate("local-login", {
			successRedirect: "/profile",
			failureRedirect: "/login",
			failureFlash: true
		}),
		function(req, res) {
			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}
			res.redirect("/");
		}
	);

	//signup page
	app.get("/signup", function(req, res) {
		res.render("signup", {
			page: "Sign Up",
			menuId: "singup",
			message: req.flash("signupMessage"),
			user: req.user
		});
	});

	app.post(
		"/signup",
		passport.authenticate("local-signup", {
			successRedirect: "/profile",
			failureRedirect: "/signup",
			failureFlash: true
		})
	);

	// profile page
	app.get("/profile", isLoggedIn, function(req, res) {
		listPromise = records.getProducts(req.user.id);
		listPromise
			.then(function(list) {
				res.render("profile", {
					page: "Profile",
					menuId: "profile",
					user: req.user,
					results: list
				});
			})
			.catch(function(error) {
				console.log(error);
			});
	});

	app.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});

	// faq page
	app.get("/faq", function(req, res) {
		res.render("faq", { page: "FAQ", menuId: "faq", user: req.user });
	});

	app.get("/list", function(req, res) {
		res.render("list", {
			page: "List",
			menuId: "list",
			user: req.user,
			list: [1, 2, 3]
		});
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();

	res.redirect("/");
}
