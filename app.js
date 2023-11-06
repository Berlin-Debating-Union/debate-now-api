const express = require('express');
const app = express();
const port = process.env.PORT || 3030;

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let dotenv = require('dotenv'); //enables environment variables for development
dotenv.load();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup database connection
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  (app.get('env') === 'production') ? process.env.DB_NAME : 'debate_now',
  (app.get('env') === 'production') ? process.env.DB_USER_NAME : 'root',
  (app.get('env') === 'production') ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_LOCAL,
  {
    host: (app.get('env') === 'production') ? process.env.DB_HOST : 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  }
);

// test the connection
sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

// disable CORS when local
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//setup routes URIs
const userApi = require('./routes/userApi')(sequelize);
const roomApi = require('./routes/roomApi')(sequelize);
const eventApi = require('./routes/eventApi')(sequelize);
const imagesApi = require('./routes/imagesApi')(sequelize);
app.use('/user', userApi);
app.use('/room', roomApi);
app.use('/event', eventApi);
app.use('/images', imagesApi);

//setup scheduled jobs
require('./scheduled_jobs/closeEvents')(sequelize);
require('./scheduled_jobs/deleteEvents')(sequelize);
require('./scheduled_jobs/deleteUsers')(sequelize);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port);
console.log('ENV: ' + app.get('env'));
console.log('Listening to port: ' + port);
