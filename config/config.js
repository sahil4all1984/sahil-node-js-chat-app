  // loading cofiguration file dynamically . process.env.NODE_ENV == development OR production
  module.exports = require('./' + process.env.NODE_ENV || 'development' + 'json');