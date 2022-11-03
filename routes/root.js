const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// {
//   // // route http method
//   // // begin with slash, end with the slash , or , slash index.html
//   // // .html become optional bcuz if we didnt do that server get error (specify .html), so its must be optional
//   // app.get('^/$|/index(.html)?', (req, res) => {
//   //   // send file
//   //   // res.sendFile('./views/index.html',{root:__dirname})
//   //   // serve file with node
//   //   res.sendFile(path.join(__dirname, 'views', 'index.html'));
//   // });
  
//   // app.get('/new-page(.html)?', (req, res) => {
//   //   res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
//   // });
  
//   // app.get('/old-page(.html)?', (req, res) => {
//   //   // 302 by default.
//   //   // specifying the status code inside parameter
//   //   // direct to the newpage
//   //   res.redirect(301, '/new-page.html');
//   // });
// }


module.exports = router;