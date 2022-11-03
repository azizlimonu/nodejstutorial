// apply cors(cross-origin-resource-sharing)
const whiteList = [
  'https://www.youtsite.com',
  'http://127.0.0.1:5500',
  'http://localhost:3500'
];
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

module.exports = corsOptions;