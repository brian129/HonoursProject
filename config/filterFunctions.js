var pool = require("./database");
var Fuse = require("fuse.js");
var results = [];
module.exports = {
	getProducts: function(id, keyword) {
		return new Promise(function(resolve, reject) {
			var insertQuery = "CALL getProducts(?)";
			var rowsPromise = pool.query(insertQuery, [id]);
			rowsPromise
				.then(function(rows) {
					results = rows[0];
					for (let i = 0; i < results.length; i++) {
						if (results[i].Name === null) {
							results[i].Name = results[i].SubItem;
							results[i].SubItem = "";
						}
					}
					//algorithm from Eydrian on https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript to remove duplicates
					results = results.filter(
						(results, index, self) =>
							self.findIndex(
								t => t.Name === results.Name && t.SubItem === results.SubItem
							) === index
					);

					//fuse algorithm here
					var options = {
						keys: ["Name", "SubItem"]
					};
					var fuse = new Fuse(results, options);

					resolve(fuse.search(keyword));
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	getProductAndComment: function(id, keyword) {
		return new Promise(function(resolve, reject) {
			var insertQuery = "CALL getProducts(?)";
			var rowsPromise = pool.query(insertQuery, [id]);
			rowsPromise
				.then(function(rows) {
					results = rows[0];
					for (let i = 0; i < results.length; i++) {
						if (results[i].Name === null) {
							results[i].Name = results[i].SubItem;
							results[i].SubItem = "";
						}
					}

					//algorithm from Eydrian on https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript to remove duplicates
					results = results.filter(
						(results, index, self) =>
							self.findIndex(
								t => t.Name === results.Name && t.SubItem === results.SubItem
							) === index
					);

					//fuse algorithm here
					var options = {
						keys: ["Name", "SubItem", "Comments"]
					};
					var fuse = new Fuse(results, options);

					resolve(fuse.search(keyword));
				})
				.catch(function(error) {
					reject(error);
				});
		});
	}
};
