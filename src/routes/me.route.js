const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const meController = require('../app/controllers/MeController');
router.get('/trash/courses', meController.trashCourses);
router.get('/stored/courses', meController.storedCourses);
router.get('/trash/categories', meController.trashCategories);
router.get('/stored/categories', meController.storedCategories);
router.get('/trash/lessons', meController.trashLessons);
router.get('/stored/lessons', meController.storedLessons);
router.get('/stored/users', meController.storedUsers);
router.put('/users/:id', meController.editRoleUser);
router.delete('/users/:id', meController.deleteUser);
module.exports = router;
