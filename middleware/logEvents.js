const { format } = require('date-fns');
const { v4: uuid } = require('uuid')

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  // this will not work bcuz appendfile didnt create directory
  // try {
  //   // createfile if theres no exists
  //   await fsPromises.appendFile(path.join(__dirname, 'logs','eventLog.txt'), logItem)
  // } catch (err) {
  //   console.log(err)
  // }

  try {
    // if the directory didnt have logs directory ,create.
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    // createfile if theres no exists
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
  } catch (err) {
    console.log(err)
  }
}

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };

// console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'))

// console.log(uuid())