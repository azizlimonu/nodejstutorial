const express = require('express');
const router = express.Router();
const path = require('path');
const employeesController = require('../../controllers/employeesController');

// route handler
router.route('/')
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployees)
  .put(employeesController.updateEmployees)
  .delete(employeesController.deleteEmployees);

router.route('/:id')
  .get(employeesController.getEmployee);

module.exports = router;