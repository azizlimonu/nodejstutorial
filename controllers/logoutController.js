const User = require('../model/User');

const handleLogout = async (req, res) => {
  // on client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  // sccs, no content 204
  const refreshToken = cookies.jwt;

  // is refreshtoken in DB ?
  // find the user if exists with the same refresh token
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    // res.clearCookie('jwt', { httpOnly: true });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  };


  // Delete the refresh token in Db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  // secure true, only serve on https
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  // res.clearCookie('jwt', { httpOnly: true });
  res.sendStatus(204);
}

module.exports = { handleLogout }