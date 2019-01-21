var express = require("express");
var router = express.Router();

// index page
router.get("/", function(req, res, next) {
	res.render("index", { page: "Home", menuId: "home" });
});

//search page
router.get("/search", function(req, res, next) {
	res.render("search", { page: "Search", menuId: "search" });
});

router.get("/send", function(req, res, next) {
	res.render("searching", { page: "Searching", menuId: "searching" });
});

// about page
router.get("/login", function(req, res) {
	res.render("login", { page: "Login", menuId: "login" });
});

// faq page
router.get("/faq", function(req, res) {
	res.render("faq", { page: "FAQ", menuId: "faq" });
});

module.exports = router;
