var pool = require("./database");
var results = [];
module.exports = {
	getProducts: function(id, parent, child) {
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
					//sort results in alphabetical order
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

					//filter results to ones containing the product name
					var filteredResults = results.filter(function(result) {
						return result.Name == parent && result.SubItem == "";
					});

					//sort the results by date
					filteredResults.sort(function compare(a, b) {
						var dateA = new Date(a.DateEnded);
						var dateB = new Date(b.DateEnded);
						return dateA - dateB;
					});
					for (i in filteredResults) {
						console.log(filteredResults[i]);
					}
					resolve(filteredResults);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	}
};
