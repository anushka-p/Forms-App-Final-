// Require statements
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');


const cors = require('cors');
const bodyParser = require('body-parser');
const dbmigrate = require('db-migrate');
const path = require('path');

// Create Express app
const app = express();

// Apply middleware
app.use(session({secret: 'cats',
resave: false,
saveUninitialized: false,}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// Apply routes
const routes = require('./api/routes/index');
app.use(routes);

// Migrations
async function runMigrations() {
  const db = dbmigrate.getInstance(true, {
    env: 'dev',
    config: path.resolve(__dirname, './database.json'),
    cwd: path.resolve(__dirname),
  });
  await db.up();
  console.log('Migrations completed successfully.');
}

runMigrations().catch(error => {
  console.error('Error running migrations:', error);
});

// Define and use port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
