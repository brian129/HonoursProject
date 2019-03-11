var pool = require("./database");
var results = [];
module.exports = {
	getProducts: function(id) {
		return new Promise(function(resolve, reject) {
			var insertQuery = "CALL getProducts(?)";
			var rowsPromise = pool.query(insertQuery, [id]);

			var par = [];
			var child = [];
			rowsPromise
				.then(function(rows) {
					results = rows[0];
					for (let i = 0; i < results.length; i++) {
						if (results[i].Name === null) {
							results[i].Name = results[i].SubItem;
							results[i].SubItem = "";
						}
						par.push(results[i].Name);
						if (results[i].SubItem != "") {
							child.push(results[i].SubItem);
						}
					}
					//sort in alphabetical order
					par.sort();
					//sort in alphabetical order
					child.sort();
					par = [...new Set(par)];
					child = [...new Set(child)];
					resolve(["Parent" + [par], "Child" + [child]]);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	}
};
