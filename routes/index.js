module.exports = function(app, passport) {
	var writeNew = require("../config/insertNewRecord");
	var writeSub = require("../config/insertSubRecord");
	var records = require("./../config/ProfileProducts");
	var ParentProduct = require("../config/getParentByName");
	var ChildProduct = require("./../config/getChildByName");
	var getNames = require("./../config/getProductNames");
	var search = require("../config/filterFunctions");
	// index page
	app.get("/", function(req, res) {
		res.render("index", { page: "Home", menuId: "home", user: req.user });
	});

	//record page
	app.get("/record", function(req, res) {
		if (req.user === undefined) {
			res.redirect("/");
		}
		listPromise = getNames.getProducts(req.user.id);
		listPromise
			.then(function(list) {
				console.log(typeof list);
				list = list.split("split");
				console.log(list);
				var parent = list[0];
				var child = list[1];

				parentArray = parent.split(",");
				childArray = child.split(",");

				res.render("record", {
					page: "Add Record",
					menuId: "record",
					user: req.user,
					itemName: parentArray,
					subItem: childArray
				});
			})
			.catch(function(error) {
				console.log(error);
			});
	});

	app.post("/record", function(req, res) {
		console.log(req.body);
		if (req.body.subItem == "") {
			writeNew
				.write(req)
				.then(function() {
					res.redirect("/profile");
				})
				.catch(function(error) {
					console.log(error);
				});
		} else if (req.body.subItem != "") {
			writeSub
				.write(req)
				.then(function() {
					res.redirect("/profile");
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	});

	// login page
	app.get("/login", function(req, res) {
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
			successRedirect: "/",
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
		if (req.user === undefined) {
			res.redirect("/");
		}
		listPromise = records.getProducts(req.user.id);
		listPromise
			.then(function(list) {
				console.log(list);
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

	app.post("/profile", function(req, res) {
		if (req.body.action == "product") {
			listPromise = search.getProducts(req.user.id, req.body.search);
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
		} else if (req.body.action == "productAndComment") {
			listPromise = search.getProductAndComment(req.user.id, req.body.search);
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
		} else {
			res.redirect("/profile");
		}
	});

	//Individual Product Page - parent
	app.get("/product/:name", function(req, res) {
		if (req.user === undefined) {
			res.redirect("/");
		}
		listPromise = ParentProduct.getProducts(req.user.id, req.params.name);
		listPromise
			.then(function(list) {
				res.render("product", {
					page: "Product",
					menuId: "product",
					user: req.user,
					product: req.params.name,
					subItem: null,
					list: list
				});
			})
			.catch(function(err) {
				console.log(err);
			});
	});

	//Individual Product Page - child
	app.get("/product/:name/:subItem", function(req, res) {
		if (req.user === undefined) {
			res.redirect("/");
		}
		listPromise = ChildProduct.getProducts(
			req.user.id,
			req.params.name,
			req.params.subItem
		);
		listPromise
			.then(function(list) {
				for (i in list) {
					console.log(list[i]);
				}
				res.render("product", {
					page: "Product",
					menuId: "product",
					user: req.user,
					product: req.params.name,
					subItem: req.params.subItem,
					list: list
				});
			})
			.catch(function(err) {
				console.log(err);
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

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect("/");
	}
};
