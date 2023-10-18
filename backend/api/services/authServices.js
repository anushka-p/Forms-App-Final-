const dbUtils = require('../../dbUtils'); // Import the dbUtils module
const bcrypt = require('bcrypt');
module.exports = {
  createUser: (body, callback) => {
    try{
      const insertQuery = `INSERT INTO users(username, useremail, password, role, state, createdby, updatedby)
      VALUES ('${body.username}', '${body.useremail}', '${body.password}', '${body.role}', '${body.state}', '${body.createdby}', '${body.updatedby}')
      RETURNING id;`;

// Use the executeQuery function from dbUtils
dbUtils.executeQuery(insertQuery, callback);
    }catch(err)
    {
      callback(err, null)
    }
    
  },
  createUserFromGoogle: async(profile, callback) => {
    const password = await bcrypt.hash('password', 10);
    const insertQuery = `INSERT INTO users(username, useremail,password, role, state, createdby, updatedby)
                         VALUES ('${profile.displayName}', '${profile.email}','${password}', 'user', 'none', 'google', 'google')
                         RETURNING id;`;

    // Use the executeQuery function from dbUtils
    dbUtils.executeQuery(insertQuery, callback);
},
  getUserByEmail: (email, callback) => {
    const query = `SELECT * FROM users WHERE useremail = '${email}'`;
    
    // Use the executeQuery function from dbUtils
    dbUtils.executeQuery(query, callback);
  }
};
