var mysql = require("mysql");

var util = require("util");

var pool = mysql.createPool({
	connectionLimit: 10,
	host: "silva.computing.dundee.ac.uk",
	user: "fhungproject",
	password: "7634.sd.4367",
	database: "fhungprojectdb"
});

pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			console.error("Database connection was closed.");
		}
		if (err.code === "ER_CON_COUNT_ERROR") {
			console.error("Database has too many connections.");
		}
		if (err.code === "ECONNREFUSED") {
			console.error("Database connection was refused.");
		}
	}
	if (connection) connection.release();
});
pool.query = util.promisify(pool.query);
module.exports = pool;
