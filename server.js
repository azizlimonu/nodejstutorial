const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions=require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// cross origins resource option
app.use(cors(corsOptions));

// built in middleware to handle urlEncoded data
// middleware is function that execute after server receive the request and before the response is sent to client
// in order words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// built in middleware serve // static files //
app.use('/',express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/employees',require('./routes/api/employees'));

// all route didnt cinclude
app.all('*', (req, res) => {
  // send file 404 
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  }else  if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found');;
  }
});
app.use(errorHandler);

app.listen(PORT, () => { console.log(`Server running on port ${PORT} `) });