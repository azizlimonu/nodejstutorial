const express = require('express');
const router = express.Router();
const path = require('path');
const employeesController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// route handler
router.route('/')
  // everybody can get to the get employee route
  .get(employeesController.getAllEmployees)
  // just admin and editor can create a new employee and update the employee
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployees)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployees)
  // but only admin can delete a employee
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployees);

router.route('/:id')
  .get(employeesController.getEmployee);

module.exports = router;
