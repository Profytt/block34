require('dotenv').config();

const { PORT = 3000 } = process.env;
const express = require('express');
const app = express();
const { pool } = require('./db');


const bodyParser = require('body-parser');
const morgan = require('morgan');


const { connectToDatabase } = require('./db');

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require('./api');
app.use('/api', apiRouter);



(async () => {
  try {
    await pool.connect();
    console.log('Connected to the database');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed!', err);
    process.exit(1); 
  }
})();