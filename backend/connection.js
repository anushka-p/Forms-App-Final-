const {Client} = require('pg');
const { dbConfig } = require('./config/dev');
const client = new Client(dbConfig)

client.connect((err)=>{
if(err)
console.log(err);
else
console.log("Connected");
});

module.exports = client;

