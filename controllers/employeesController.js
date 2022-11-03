const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
  res.json(data.employees);
}

const createNewEmployees = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({
      "message": "firstname and lastname are required"
    })
  }
  // set employees to the new information
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees)
}

const updateEmployees = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({
      "message": `Employee ID ${req.body.id} not found`
    });
  }

  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;

  // filter array remove the exist employee from it.
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  // cronological order id
  const unsortedArray = [...filteredArray, employee];

  // sorted array id, if the one element of id has greater than return 1,
  data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  res.json(data.employees);
}

const deleteEmployees = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

  if (!employee) {
    return res.status(400).json({
      "message": `Employee ID ${req.body.id} not found`
    });
  }

  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
}

const getEmployee = ((req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));

  if (!employee) {
    return res.status(400).json({
      "message": `Employee ID ${req.params.id} not found`
    });
  }
  res.json(employee);
})

module.exports = {
  getAllEmployees,
  createNewEmployees,
  updateEmployees,
  deleteEmployees,
  getEmployee
}
