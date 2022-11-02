const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

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
  res.redirect(301,'/new-page.html');
});

// route handlers
app.get('/hello(.html)?',(req,res,next)=>{
  console.log('attempted to load hello.html');
  // next => move to the next handler or next expression and call next function in the chain
  next();
},(req,res)=>{
  res.send('Hello World..');
});

// chaining route handlers
const one = (req,res,next)=>{
  console.log('One');
  next();
}
const two = (req,res,next)=>{
  console.log('Two');
  next();
}
const three = (req,res,next)=>{
  console.log('Three');
  res.send('Finished')
}

// use all the routes ^^^
app.get('/chain(.html)?',[one,two,three]);

// all route
app.get('/*',(req,res)=>{
  // send file 404 
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));

})


app.listen(PORT, () => { console.log(`Server running on port ${PORT} `) })