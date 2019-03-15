var mysql = require("mysql");

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
			return "Database connection was closed.";
		}
		if (err.code === "ER_CON_COUNT_ERROR") {
			return "Database has too many connections.";
		}
		if (err.code === "ECONNREFUSED") {
			return "Database connection was refused.";
		}
	}
	if (connection) connection.release();
});
module.exports = pool;
