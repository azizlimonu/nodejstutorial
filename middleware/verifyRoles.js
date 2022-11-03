const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log(rolesArray)
    console.log(req.roles)

    // map the roles from jwt, comparing the roles array, find if is true or first true
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    // check the value to true.
    if(!result) return res.sendStatus(401);
    next();
  }
}

module.exports=verifyRoles; 