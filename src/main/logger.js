const winston = require('winston');

let Logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        timestamp: true,
        level: 'info'
      }),
      new (winston.transports.File)({
        level: 'info',
        timestamp: true,
        silent: true,
        filename: 'desktopr.log',
        maxsize: 5000000,
        maxFiles: 5,
        tailable: true
      })
    ]
  });

module.exports = Logger;