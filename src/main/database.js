const fs = require('fs');
const sql = require('sql.js');
const path = require('path');

const CONSTANTS = require.main.require('./src/constants/constants.js');

let databaseFilePath = path.resolve(CONSTANTS.PATH, 'db', 'desktopr.sqlite');
const bfr = fs.readFileSync(databaseFilePath);

sql.Database.prototype.save = function (file) {
  let byteArray = this.export();
  let buffer = new Buffer(byteArray.length);

  for (var i = 0; i < byteArray.length; i++) {
    buffer.writeUInt8(byteArray[i], i);
  }
  fs.writeFileSync(file, buffer);
};

sql.Database.prototype.execute = function(sql) {
  this.exec(sql);
  // Save the database to the file
  this.save(databaseFilePath);
};

module.exports = new sql.Database(bfr);