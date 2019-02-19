var pool = require("./database");
var dbconfig = require("./database");
pool.query("USE " + dbconfig.database);

module.exports = function(req) {
	var insertQuery = "CALL insertSubItem(?,?,?,?,?,?,?,?,?,?)";
	pool.query(
		insertQuery,
		[
			req.body.name,
			req.body.subVersion,
			req.body.buyingFormat,
			req.body.dateEnded,
			req.body.time,
			req.body.soldStatus,
			req.body.endingPrice,
			req.body.condition,
			req.body.comments,
			req.user.id
		],
		function(err, rows) {
			if (err) throw err;
		}
	);
};
