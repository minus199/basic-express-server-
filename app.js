const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Make sure to npm install/yarn install passport
const passport = require("./passport-setup");
//Make sure to npm install/yarn install express-session
const session = require("express-session");
const authCheck = require("./middleware/authCheck")

const cors = require("cors")


const indexRouter = require('./routes/index');
const devicesRouter = require('./routes/devices');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');
const dictionaryRouter = require("./routes/dictionary")

const connectToMongo = require("./db")

connectToMongo()

const app = express();
app.use(cors());

// General middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session middleware
app.use(session({
  secret: 'my-super-secret-session-key', //todo: load from file
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

// Passport middleware -- must be after express session(line 35)
app.use(passport.initialize());
app.use(passport.session());

// routers
// app.use('/', indexRouter);
app.use("/auth", authRouter);
app.use('/api/devices', authCheck, devicesRouter);
app.use('/api/dictionary', dictionaryRouter)
app.use('/api/uploads', authCheck, uploadRouter);
/*
  todo: add users router that can do the following:
  GET /users/:email to get a user by email 
  PUT /users to update a user
  DELETE /users/:email to delete a user 

  Add ui for all the new endpoints
*/

/* please notice that all html are served from the routers instead from the public dir. 
This is because the routers are secured(only logged-in users can access) 
We want to hide these pages from users which are not logged in */
// const dynamicPath = path.join(__dirname, '../', 'hello-world-react/build')

const buildPath = process.env['DICTIONARY_FE_BUILD_PATH']
if (buildPath) {
  console.log(`Hosting static content from ${buildPath}`)
  app.use(express.static(buildPath));
}


// Error handling
// if all routers have failed to catch this request, or error has occured
// error handler -- when an error occures, this is the general error handler that will happen after all the other middlewares and routers (in the end of the request cycle)
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ err: err.message });
});

module.exports = app;
