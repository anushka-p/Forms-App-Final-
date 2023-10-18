const client = require('../backend/connection');

// Function to execute a database query
const executeQuery = (query, callback) => {
  client.query(query, (error, result) => {
    if (error) {
      return callback(error);
    }
    return callback(null, result);
  });
};

module.exports = { executeQuery };
