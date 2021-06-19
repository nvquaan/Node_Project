const express = require('express');
const router = express.Router();

const appController = require('../app/controllers/AppController');
const authController = require('../app/controllers/AuthController');
const userController = require('../app/controllers/UserController');
const { verifySignUp } = require("../app/middlewares");
const { authJwt } = require("../app/middlewares");
//AUTH
router.post('/auth/signup', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], authController.signup);
router.get('/auth/verify-signup', authController.verifySignup);
router.post('/auth/signin', authController.signin);
router.post('/auth/forget-password', [verifySignUp.isVerified] , authController.forgetPassword);
router.get('/auth/check-signin/:slug', [authJwt.verifyToken], authController.checkSignin);
router.post('/user/edit', [authJwt.verifyToken], authController.editUser);
//CATEGORIES
router.get('/categories/:slug/courses', appController.getAllCoursesOfCategory);
router.get('/categories/:slug', appController.getOneCategory);
router.get('/categories', appController.getAllCategories);
router.get('/trash/categories', appController.trashCategories);
router.post('/categories/search', appController.searchCategories);

//COURSES
router.get('/courses/hot', appController.getAllHotCourse);
router.post('/courses/search', appController.searchCourses);
router.post('/courses/buy', [authJwt.verifyToken], appController.buyCourses);
router.get('/courses/:slug/lessons', [authJwt.verifyToken], appController.getAllLessonsOfCourse);
router.get('/courses/:slug', appController.getOneCourse);
router.get('/courses/', appController.getAllCourses);
router.get('/trash/courses/', appController.trashCourses);
//Rate course
router.put('/courses/rate/:slug', [authJwt.verifyToken], appController.rateCourse);
router.put('/courses/rate-edit/:slug', [authJwt.verifyToken], appController.updateRateCourse);
router.get('/courses/rate/:slug', appController.getAllRates);
router.delete('/courses/rate/:slug/:id',[authJwt.verifyToken, authJwt.isModeratorOrAdmin], appController.deleteRateCourse);

//LESSONS
router.get('/lessons/:slug', appController.getOneLesson);
router.get('/lessons/', appController.getAllLessons);
router.get('/trash/lessons/', appController.trashLessons);

module.exports = router;
