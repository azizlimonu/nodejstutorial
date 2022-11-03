const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) return res.status(400).json({
    "message": "Username and password required"
  });

  // check for duplicate username in DB
  const duplicate = usersDB.users.find(person => person.username === user);
  // conflict status
  if (duplicate) return res.sendStatus(409);

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const newUser = {
      "username": user,
      "roles": { "User": 2001 },
      "password": hashedPwd
    }
    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    // new user created
    res.status(201).json({ 'success': `New user ${user} successfully created` });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
}

module.exports = { handleNewUser };