var pool = require("./database");
var results = [];
module.exports = {
	getProducts: function(id) {
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

					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	}
};
