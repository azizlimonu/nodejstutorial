const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  // on client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  // sccs, no content 204

  const refreshToken = cookies.jwt;

  // is refreshtoken in DB ?
  // find the user if exists with the same refresh token
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
  if (!foundUser) {
    // res.clearCookie('jwt', { httpOnly: true });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  };

  // Delete the refresh token in Db
  const otherUsers = usersDB.users.filter((person) => person.refreshToken !== foundUser.refreshToken);

  const currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  );

  // secure true, only serve on https
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  // res.clearCookie('jwt', { httpOnly: true });
  res.sendStatus(204);
}

module.exports = { handleLogout }