var ebay = require("ebay-api");
//functions from ebay
module.exports = {
	getItems: function(params) {
		ebay.xmlRequest(
			{
				serviceName: "Finding",
				opType: "findCompletedItems",
				appId: "BrianHun-HonoursP-PRD-939332c51-500339d7", // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
				params: params,
				parser: ebay.parseResponseJson, // (default)
				country: "GB"
			},
			// gets all the items together in a merged array
			function itemsCallback(error, itemsResponse) {
				if (error) throw error;

				var items = itemsResponse.searchResult.item;

				console.log("Found", items.length, "items");

				for (var i = 0; i < items.length; i++) {
					console.log("- " + items[i].title);
				}
			}
		);
	},
	callEbay2: function(params) {}
};
