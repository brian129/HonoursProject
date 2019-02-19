var pool = require("./database");
var dbconfig = require("./database");
pool.query("USE " + dbconfig.database);

module.exports = function(req) {
	var insertQuery = "SELECT * FROM products WHERE ";
	pool.query(insertQuery, [req.user.id], function(err, rows) {
		if (err) throw err;
	});
};
