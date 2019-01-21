var express = require("express");
var router = express.Router();

var ebay = require("../test");

var params = {
	keywords: ["p20 pro"],

	// add additional fields
	outputSelector: ["CategoryHistogram"],

	paginationInput: {
		entriesPerPage: 10
	},

	itemFilter: [
		{ name: "SoldItemsOnly", value: true },
		{ name: "MinPrice", value: "450" }
	]

	//domainFilter: [{ name: "domainName", value: "Digital_Cameras" }]
};

// index page
router.get("/", function(req, res, next) {
	res.render("index", { page: "Home", menuId: "home" });
	ebay.fetchItems(params);
});

//search page
router.get("/search", function(req, res, next) {
	res.render("search", { page: "Search", menuId: "search" });
	ebay.getItemDetails(201242679917);
	console.log("search page");
});

router.get("/send", function(req, res, next) {
	res.render("searching", { page: "Searching", menuId: "searching" });
	ebay.getItemDetails(req.body.ebayId);
	console.log("send page");
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
