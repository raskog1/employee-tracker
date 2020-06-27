const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 3306,
    user: "root",
    password: "root",
    database: "company_db",
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("Server running on PORT " + connection.host);
});

module.exports = connection;

