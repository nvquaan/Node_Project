const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');


router.get('/login', siteController.login);
router.get('/', siteController.getAllCourses);

module.exports = router;
