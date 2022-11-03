const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// apply cors(cross-origin-resource-sharing)
const whiteList = ['https://www.youtsite.com', 'http://127.0.0.1:5500', 'http://localhost:3500']
// that will be access your data/backend/server to fetch 
// allow cors 
const corsOptions = {
  origin: (origin, callback) => {
    // in other words if the domain is NOT the whitelist than let it pass
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
      // the origin will be sendback
    } else {
      callback(new Error('not allowed by cors'));
    }
  },
  optionsSuccessStatus: 200
}
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
app.use('/subdir',express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/subdir',require('./routes/subdir'));
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