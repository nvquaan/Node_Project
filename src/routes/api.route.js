const express = require('express');
const router = express.Router();

const appController = require('../app/controllers/AppController');
const authController = require('../app/controllers/AuthController');
const userController = require('../app/controllers/UserController');
const { verifySignUp } = require("../app/middlewares");
const { authJwt } = require("../app/middlewares");
//AUTH
router.post('/auth/signup', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], authController.signup);
router.post('/auth/signin', authController.signin);

//TEST Quyen
router.get('/test/user', [authJwt.verifyToken], userController.userBoard);
//CATEGORIES
router.get('/categories/:slug', appController.getOneCategory);
router.get('/categories', appController.getAllCategories);
router.get('/trash/categories', appController.trashCategories);

//COURSES
router.get('/courses/:slug/lessons', appController.getAllLessonsOfCourse);
router.get('/courses/:slug', appController.getOneCourse);
router.get('/courses/', appController.getAllCourses);
router.get('/trash/courses/', appController.trashCourses);
router.put('/courses/:slug', appController.updateOneCourse)

//LESSONS
router.get('/lessons/:slug', appController.getOneLesson);
router.get('/lessons/', appController.getAllLessons);
router.get('/trash/lessons/', appController.trashLessons);
module.exports = router;
