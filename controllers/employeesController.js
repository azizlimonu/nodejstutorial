const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) return res.status(204).json({ "message": "No Employe Found" });
  res.json(employees);
}

const createNewEmployees = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res.status(400).json({ "message": "Firstname and lastname required" });
  }

  // set employees to the new information
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }

}

const updateEmployees = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ "message": "ID is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res.status(204).json({
      "message": `No ID matchess and Employee ID ${req.body.id} not found`
    });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();
  res.json(result)
}

const deleteEmployees = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ "message": "Employee ID required" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res.status(204).json({
      "message": `Employee ID ${req.body.id} not found`
    });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
}

const getEmployee = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ "message": "Employee ID required" });

  const employee = await Employee.findOne({_id:req.params.id}).exec();

  if (!employee) {
    return res.status(204).json({
      "message": `Employee ID ${req.params.id} not found`
    });
  }
  res.json(employee);
}

module.exports = {
  getAllEmployees,
  createNewEmployees,
  updateEmployees,
  deleteEmployees,
  getEmployee
}
