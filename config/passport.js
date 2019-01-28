var LocalStrategy = require("passport-local").Strategy;

var mysql = require("mysql");
var bcrypt = require("bcrypt-nodejs");
var dbconfig = require("./database");
var connection = mysql.createConnection(dbconfig.connection);

connection.query("USE " + dbconfig.database);

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		connection.query("SELECT * FROM users WHERE id = ? ", [id], function(
			err,
			rows
		) {
			done(err, rows[0]);
		});
	});

	passport.use(
		"local-signup",
		new LocalStrategy(
			{
				usernameField: "username",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, username, password, done) {
				connection.query(
					"SELECT * FROM users WHERE username = ? ",
					[username],
					function(err, rows) {
						if (err) return done(err);
						if (rows.length) {
							return done(
								null,
								false,
								req.flash("signupMessage", "That is already taken")
							);
						} else {
							var newUserMysql = {
								username: username,
								password: bcrypt.hashSync(password, null, null)
							};

							var insertQuery =
								"INSERT INTO users (username, password) values (?, ?)";

							connection.query(
								insertQuery,
								[newUserMysql.username, newUserMysql.password],
								function(err, rows) {
									newUserMysql.id = rows.insertId;

									return done(null, newUserMysql);
								}
							);
						}
					}
				);
				connection.release();
			}
		)
	);

	passport.use(
		"local-login",
		new LocalStrategy(
			{
				usernameField: "username",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, username, password, done) {
				connection.query(
					"SELECT * FROM users WHERE username = ? ",
					[username],
					function(err, rows) {
						if (err) {
							console.log("[mySQL error]" + err);
							return done(err);
						}

						if (!rows.length) {
							return done(
								null,
								false,
								req.flash("loginMessage", "No User Found"),
								console.log(bcrypt.hashSync("12345", null, null))
							);
						}
						if (!bcrypt.compareSync(password, rows.password))
							return done(
								null,
								false,
								req.flash("loginMessage", "Wrong Password"),
								console.log("not correct")
							);
						console.log("successful");
						return done(null, rows[0]);
					}
				);
			}
		)
	);
};
