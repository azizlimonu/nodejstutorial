// core modules
const http = require('http');
// direct folder /file
const path = require('path');
// file system module and handle the async
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter { };

// initialize object
const myEmitter = new Emitter();
// add listener for the log event
myEmitter.on('log', (msg,fileName) => { logEvents(msg,fileName) });

const PORT = process.env.PORT || 3500;
const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf-8' : '',
    );
    const data = contentType === 'application/json'
      ? JSON.parse(rawData) : rawData;
    response.writeHead(
      filePath.includes('404.html') ? 404 : 200,
      { 'Content-Type': contentType },
    );
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    );
  } catch (error) {
    console.log(error);
    myEmitter.emit('log', `${error.name}: ${error.message}`,'reqLog.txt');
    response.statusCode = 500;
    response.end();
  }
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit('log', `${req.url}\t${req.method}`,'reqLog.txt');

  // build path, serve file to the server
  // define path
  // let filePath;
  // its work but not efficient 
  // if (req.url === '/' || req.url === 'index.html') {
  //   res.statusCode = 200; 
  //   // serving html page
  //   res.setHeader('Content-Type', 'text/html');
  //   // define path value
  //   path = path.join(__dirname, 'views', 'index.htl');
  //   // read the file take the data and send the data in index.html
  //   fs.readFile(path, 'utf-8', (error, data) => {
  //     res.end(data);
  //   })
  // }

  // 2
  // switch (req.url) {
  //   case '/':
  //     res.statusCode = 200;
  //     // define path value
  //     path = path.join(__dirname, 'views', 'index.htl');
  //     // read the file take the data and send the data in index.html
  //     fs.readFile(path, 'utf-8', (error, data) => {
  //       res.end(data);
  //     })
  //     break;

  //   default:
  //     break;
  // }

  const extension = path.extname(req.url);
  let contentType;
  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
  }

  // chain ternary
  let filePath =
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
        ? path.join(__dirname, 'views', req.url, 'index.html')
        : contentType === 'text/html'
          ? path.join(__dirname, 'views', req.url)
          : path.join(__dirname, req.url);

  // makes .html extension not require in the browser
  if (!extension && req.url.slice(-1) !== '/') {
    filePath += '.html';
  }
  // check the filepath exists
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    // serve file
    serveFile(filePath, contentType, res);

  } else {
    // 404 or 301 direct
    switch (path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { 'Location': '/new-page.html' });
        res.end();
        break;

      case 'www-page.html':
        res.writeHead(301, { 'Location': '/' });
        res.end();
        break;
      default:
        // serve a 404 response
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
    }
  }
});


server.listen(PORT, () => { console.log(`Server running on port ${PORT} `) })




