const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const meController = require('../app/controllers/MeController');
router.get('/trash/courses',[auth.isAdmin], meController.trashCourses);
router.get('/stored/courses',[auth.isAdmin], meController.storedCourses);
router.get('/trash/categories',[auth.isAdmin], meController.trashCategories);
router.get('/stored/categories',[auth.isAdmin], meController.storedCategories);
router.get('/trash/lessons',[auth.isAdmin], meController.trashLessons);
router.get('/stored/lessons',[auth.isAdmin], meController.storedLessons);
router.get('/stored/users',[auth.isAdmin], meController.storedUsers);
router.put('/users/:id',[auth.isAdmin], meController.editRoleUser);
router.delete('/users/:id',[auth.isAdmin], meController.deleteUser);
module.exports = router;
