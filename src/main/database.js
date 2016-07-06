const fs = require('fs');
const sql = require('sql.js');
const path = require('path');

const CONSTANTS = require.main.require('./src/constants/constants.js');

const bfr = fs.readFileSync(path.resolve(CONSTANTS.PATH, 'db', 'desktopr.sqlite'));
let db = new sql.Database(bfr);

module.exports = db;