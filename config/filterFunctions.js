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
					//sort in alphabetical order
					results.sort(function(a, b) {
						var x = a.Name.toLowerCase();
						var y = b.Name.toLowerCase();
						if (x < y) {
							return -1;
						}
						if (x > y) {
							return 1;
						}
						return 0;
					});
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
					//sort in alphabetical order
					results.sort(function(a, b) {
						var x = a.Name.toLowerCase();
						var y = b.Name.toLowerCase();
						if (x < y) {
							return -1;
						}
						if (x > y) {
							return 1;
						}
						return 0;
					});

					//algorithm from Eydrian on https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript to remove duplicates
					results = results.filter(
						(results, index, self) =>
							self.findIndex(
								t => t.Name === results.Name && t.SubItem === results.SubItem
							) === index
					);

					//fuse algorithm here
					var options = {
						shouldSort: true,
						tokenize: true,
						threshold: 0.4,
						location: 0,
						distance: 4,
						maxPatternLength: 32,
						minMatchCharLength: 1,
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
