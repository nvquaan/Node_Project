const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');
router.get('/trash/courses', meController.trashCourses);
router.get('/stored/courses', meController.storedCourses);
router.get('/trash/categories', meController.trashCategories);
router.get('/stored/categories', meController.storedCategories);
router.get('/trash/lessons', meController.trashLessons);
router.get('/stored/lessons', meController.storedLessons);
module.exports = router;
