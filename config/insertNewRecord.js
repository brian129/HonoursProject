var pool = require("./database");
module.exports = {
	write: function(req) {
		return new Promise(function(resolve, reject) {
			var insertQuery = "CALL insertParentItem(?,?,?,?,?,?,?,?,?)";
			var rowsPromise = pool.query(insertQuery, [
				req.body.name,
				req.body.buyingFormat,
				req.body.dateEnded,
				req.body.time,
				req.body.soldStatus,
				req.body.endingPrice,
				req.body.condition,
				req.body.comments,
				req.user.id
			]);
			rowsPromise
				.then(function() {
					resolve();
				})
				.catch(function(err) {
					reject(err);
				});
		});
	}
};
