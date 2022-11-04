const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) return res.status(400).json({
    "message": "Username and password required"
  });

  // find the user if exists
  const foundUser = usersDB.users.find(person => person.username === user)
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
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);

    // put the refresh token to the userObject
    const currentUser = { ...foundUser, refreshToken }

    // set the user to the state
    usersDB.setUsers([...otherUsers, currentUser]);

    // put the users info to the users.json file (like DB)
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    )
    res.cookie('jwt', refreshToken, { httpOnly: true, samesite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
    // res.json({ 'success': `user ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin }