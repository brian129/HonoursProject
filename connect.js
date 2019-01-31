let mysql = require("mysql");

let connection = mysql.createConnection({
	host: "silva.computing.dundee.ac.uk",
	user: "fhungproject",
	password: "7634.sd.4367",
	database: "fhungprojectdb"
});
connection.connect(function(err) {
	if (err) {
		return console.error("error: " + err.message);
	}

	console.log("Connected to the MySQL server.");
});
