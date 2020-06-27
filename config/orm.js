// Import MySQL connection.
var db = require("../config/db");

var orm = {
  listNames: function (tableInput, columnInput, cb) {
    var queryString = "SELECT ?? FROM ??";
    db.query(queryString, [columnInput, tableInput], function (err, result) {
      if (err) throw err;
      cb(result);
    });
  },
};

module.exports = orm;
