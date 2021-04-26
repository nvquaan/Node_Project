const express = require('express');
const router = express.Router();

const appController = require('../app/controllers/AppController');

//CATEGORIES
router.get('/categories/:slug', appController.getOneCategory);
router.get('/categories', appController.getAllCategories);
router.get('/trash/categories', appController.trashCategories);

//COURSES
router.get('/courses/:slug', appController.getOneCourse);
router.get('/courses/', appController.getAllCourses);
router.get('/trash/courses/', appController.trashCourses);
module.exports = router;
