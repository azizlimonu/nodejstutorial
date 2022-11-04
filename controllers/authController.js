const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) return res.status(400).json({
    "message": "Username and password required"
  });

  // find the user if exists
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401);

  // evalueate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWT
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // save the refres h token in db, create logout route, invalidate refresh token
    // otherusers => array of the user thats not login
    foundUser.refreshToken = refreshToken;
    // save to mongoDB
    const result = await foundUser.save();
    console.log(result)

    res.cookie('jwt', refreshToken, { httpOnly: true, samesite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
    // res.json({ 'success': `user ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin }