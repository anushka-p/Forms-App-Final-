const adminServices = require('../services/adminServices');
const getAll = async (req, res) => {
  try {
    const { sortBy, state, role, limit, offset, username} = req.query;

    // Build the base SQL query
    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) FROM users'; // New query to count total items
    let conditions = [];

    // Add conditions if parameters are provided
    if (state) {
      conditions.push(`state = '${state}'`);
    }

    if (role) {
      conditions.push(`role = '${role}'`);
    }
    if(username)
    {
      conditions.push(`username = '${username}'`)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    if (sortBy) {
      const [field, order] = sortBy.split(':');
      query += ` ORDER BY ${field} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    }

    // Add pagination
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    // Get total items count
    await adminServices.getAllUsers(countQuery, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Connection error" });
      }
      const totalItems = results.rows[0].count;

      // Retrieve paginated data
      adminServices.getAllUsers(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Connection error" });
        }
        const data = results.rows.map(user => {
          const { password, ...rest } = user;
          return rest;
        });

        return res.status(200).json({
          data,
          totalItems, // Include totalItems in the response
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Database connection error...",
    });
  }
};


const addNewUserFormSubmission = async (req, res)=>{
  try{
    const formid = req.params.id;
    const body = {...req.body, formid}
    // console.log(body);
    await adminServices.createNewFormSubmission(body, (err, results)=>{
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database connection error.......",
        });
      }
      return res.status(200).json({
        message:'New Submission created.'
      });
    })
  }catch(e){

  }
}
const getSubmittedForm = async(req, res)=>{
  try{
    const id = req.params.userid;
    await adminServices.getSubmittedForms(id, (err, results)=>{
      if(err){
        console.log(err);
        return res.status(500).json({message: "Database connection error"})
      }
      return res.status(200).json({
        data: results.rows,
        message: "Retrieved successfully"
      })
    })
  }catch(err)
  {
    throw err;
  }
}

const otherFormSubmission = async(req, res)=>{
  try{
    const id = req.params.id;
    await adminServices.getOtherFormSubmission(id, (err, results)=>{
      if(err){
        console.log(err);
        return res.status(500).json({message: "Database connection error"})
      }
      return res.status(200).json({
        data: results.rows,
        message: "Retrieved successfully"
      })
    })
  }catch(err)
  {
    throw err;
  }
}

const formControlResponse = async(req, res)=>{
  try{
    const id = req.params.userid;
    const formid = req.params.formid;
    await adminServices.getFormControlResponse(id,formid, (err, results)=>{
      if(err){
        console.log(err);
        return res.status(500).json({message: "Database connection error"})
      }
      return res.status(200).json({
        data: results.rows,
        message: "Retrieved successfully"
      })
    })
  }catch(err)
  {
    throw err;
  }
}
const addNewForm = async (req, res) =>{
      try{
        await adminServices.createNewForm(req.body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "Database connection error.......",
            });
          }
          return res.status(200).json({
            data: results,
            message:'Form created.'
          });
        });
      }catch(e){
        console.log(e);
      }
}

const getForm = async (req,res) =>{
    try{
      const id = await req.params.id;
      if(id)
      {
      await adminServices.getFormById(id, (err, results)=>{
        if(err)
        {
          return res.status(500).json({message: "Database connection error"})
        }
        if(results.rows.length === 0)
        {
          return res.status(404).json({message: "form not found"})
        }
        return res.status(200).json({
          data: results.rows[0]
        })
      })
    } else{
      await adminServices.getForms((err, results)=>{
        if(err)
        {
          return res.status(500).json({message: "Database connection error"})
        }
        
        const data = results.rows.map(form => {
          const {
              formfields,
              ...rest
          } = form;
  
          return rest;
      });
  
      return res.status(200).json({
          data
      });
      })
    }
    }catch(e){
      console.log(e);
    }
}

const updateForm = async (req, res) => {
    try {
      const id = req.params.id;
      //to check if a user exists or not and then update
      await adminServices.getFormById(id, (err, results) => {
        if (results.rows.length === 0) {
          return res.status(404).json({ message: "Form not found" });
        }
        const updatedFormData = req.body;
         adminServices.updateFormByid(id, updatedFormData, (err, results) => {
            if (err) {
              return res.status(500).json({ message: "Database connection error" });
            }
            return res.status(200).json({ message: "Form updated successfully" });
          });
    });
     
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

const deleteForm = async (req, res) => {
  try { 
    const id =  req.params.formid; 
    await adminServices.getFormById(id, (err, results) => {
      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      // If the form exists, proceed with deletion
      adminServices.deleteFormByid(id, (err, results) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.status(200).json({
          message: "Form deleted successfully"
        });
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { getAll , addNewForm, getForm, updateForm, deleteForm, addNewUserFormSubmission, getSubmittedForm,
formControlResponse, otherFormSubmission};

