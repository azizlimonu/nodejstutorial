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
// built in middleware serve static files
app.use(express.static(path.join(__dirname, '/public')));

// route http method
// begin with slash, end with the slash , or , slash index.html
// .html become optional bcuz if we didnt do that server get error (specify .html), so its must be optional
app.get('^/$|/index(.html)?', (req, res) => {
  // send file
  // res.sendFile('./views/index.html',{root:__dirname})
  // serve file with node
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
  // 302 by default.
  // specifying the status code inside parameter
  // direct to the newpage
  res.redirect(301, '/new-page.html');
});

// route handlers
app.get('/hello(.html)?', (req, res, next) => {
  console.log('attempted to load hello.html');
  // next => move to the next handler or next expression and call next function in the chain
  next();
}, (req, res) => {
  res.send('Hello World..');
});

// chaining route handlers
const one = (req, res, next) => {
  console.log('One');
  next();
}
const two = (req, res, next) => {
  console.log('Two');
  next();
}
const three = (req, res, next) => {
  console.log('Three');
  res.send('Finished')
}

// use all the routes ^^^
app.get('/chain(.html)?', [one, two, three]);

// app.use(specify the chain)
// app.use didnt accept regex

// all route
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

// // handle Error built-in middleware
// app.use(function(err,req,res,next){
//   console.error(err.stack);
//   res.status(500).send(err.message);
// })
app.use(errorHandler);

app.listen(PORT, () => { console.log(`Server running on port ${PORT} `) });