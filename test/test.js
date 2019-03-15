var pool = require("../dbConnection");

//test for database connection
it("db.connection.connect should not return any error", function(done) {
	pool.getConnection(function(err, result) {
		if (err) {
			done(err);
			return;
		}
		done();
	});
});
//next test
it("2nd", function(done) {
	pool.getConnection(function(err, result) {
		if (err) {
			done(err);
			return;
		}
		done();
	});
});
