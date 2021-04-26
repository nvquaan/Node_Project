const Course = require('../models/Course');
const Category = require('../models/Category');
const {PromiseProvider} = require('mongoose');

class MeController {
    //[GET] me/stored/courses
    storedCourses(req, res, next) {
        Promise.all([Course.find({}).populate('category', 'name'), Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => {
                courses = courses.map(course => course.toObject());
                res.render('me/stored-courses', {deletedCount, courses});
            })
            .catch(next)
    }

    //[GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then(deletedCourses => {
                deletedCourses = deletedCourses.map(course => course.toObject());
                res.render('me/trash-courses', {deletedCourses});
            })
            .catch(next)
    }

    //[GET] me/stored/categories
    storedCategories(req, res, next) {
        // console.log(req.baseUrl);
        Promise.all([Category.find({}).sortable(req), Category.countDocumentsDeleted()])
            .then(([categories, deletedCount]) => {
                categories = categories.map(category => category.toObject());
                res.render('me/stored-categories', {deletedCount, categories});
            })
            .catch(next)
    }

    //[GET] /me/trash/categories
    trashCategories(req, res, next) {
        Category.findDeleted({})
            .then(deletedCategories => {
                deletedCategories = deletedCategories.map(course => course.toObject());
                res.render('me/trash-categories', {deletedCategories});            })
            .catch(next)
    }

}

module.exports = new MeController;
