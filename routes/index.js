var express = require("express");
var router = express.Router();

var ebay = require("../test");

var params = {
	keywords: ["p20 pro"],

	// add additional fields
	outputSelector: ["AspectHistogram"],

	paginationInput: {
		entriesPerPage: 10
	},

	itemFilter: [
		/*{ name: "FreeShippingOnly", value: true },*/
		{ name: "MaxPrice", value: "450" }
	]

	//domainFilter: [{ name: "domainName", value: "Digital_Cameras" }]
};

// index page
router.get("/", function(req, res, next) {
	res.render("index", { page: "Home", menuId: "home" });
	ebay.getItems(params);
});

//search page
router.get("/search", function(req, res, next) {
	res.render("search", { page: "Search", menuId: "search" });
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
