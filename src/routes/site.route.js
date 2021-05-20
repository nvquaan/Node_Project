const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const { auth } = require("../app/middlewares");


router.get('/', siteController.login);
router.get('/signout', siteController.logout);
router.post('/signin', siteController.signin);
router.get('/home', [auth.isLoggedIn], siteController.getAllCourses);
router.get('/report', siteController.report);

module.exports = router;
