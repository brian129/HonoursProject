var ebay = require("ebay-api");
util = require("util");
var appKey = "BrianHun-HonoursP-PRD-939332c51-500339d7";
//functions for ebay api
module.exports = {
	fetchItems: function(params) {
		ebay.xmlRequest(
			{
				serviceName: "Finding",
				opType: "findCompletedItems",
				appId: appKey, // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
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
					//if()
					console.log(
						"- " +
							items[i].primaryCategory.categoryName +
							" " +
							items[i].title +
							" " +
							items[i].listingInfo.endTime +
							" " +
							items[i].sellingStatus.convertedCurrentPrice.amount +
							" " +
							items[i].sellingStatus.sellingState
					);
				}
			}
		);
	},
	getItemDetails: function(id) {
		ebay.xmlRequest(
			{
				serviceName: "Shopping",
				opType: "GetSingleItem",
				appId: appKey, // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI

				params: {
					ItemID: 153182547170 // FILL IN A REAL ItemID
				}
			},
			function(error, data) {
				if (error) throw error;

				var items = data.item;

				console.log(data.title);
			}
		);
	}
};
