const dbUtils = require('../../dbUtils');
const bcrypt = require('bcrypt');
module.exports= {
    getUserByid :async (id, callback) => {
        try{
            const query = `SELECT * FROM users WHERE id = ${id}`;
            dbUtils.executeQuery(query, callback)
          }catch(e)
          {
            throw e;
          }
    },

    updateUserByid: (id, updatedUserData, callback) => {
        // Start the query with the common part
        let updateQuery = `
          UPDATE users
          SET
        `;
        const fieldUpdates = [];
        if (updatedUserData.username) {
            fieldUpdates.push(`username = '${updatedUserData.username}'`);
        }
        if (updatedUserData.useremail) {
            fieldUpdates.push(`useremail = '${updatedUserData.useremail}'`);
        }
        if (updatedUserData.state) {
            fieldUpdates.push(`state = '${updatedUserData.state}'`);
        }
        if(updatedUserData.role)
        {
            fieldUpdates.push(`role = '${updatedUserData.role}'`)
        }
        if(updatedUserData.updatedby) {
            fieldUpdates.push(`updatedby = '${updatedUserData.updatedby}'`)
        }
    
        // Check if password is provided and add it to the updates
        if (updatedUserData.password) {
            bcrypt.hash(updatedUserData.password, 10, (err, hashedPassword) => {
                if (err) {
                    return callback(err);
                }
                fieldUpdates.push(`password = '${hashedPassword}'`);
                // Join the field updates and complete the query
                updateQuery += fieldUpdates.join(', ') + ` WHERE id = ${id};`;
                dbUtils.executeQuery(updateQuery, callback);
            });
        } else {
            // If no fields provided for update, return a message
            if (fieldUpdates.length === 0) {
                return callback({ message: "No fields provided for update." }, null);
            }
            // Join the field updates and complete the query (no password update)
            updateQuery += fieldUpdates.join(', ') + ` WHERE id = ${id};`;
            dbUtils.executeQuery(updateQuery, callback);
        }
    },
    
    
      deleteUserByid:(id, callback)=>{
        try{
            const query =  `DELETE FROM users WHERE id = ${id}`;
            dbUtils.executeQuery(query, callback);
          }catch(e){
            throw new Error('User not found')
          }
      }
}

//registration page //signin //home //404  -->authenticated routes