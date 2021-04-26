const Category = require("../models/Category");
const Course = require("../models/Course");
const {response} = require('../lib/response');
const {error} = require('../lib/error');

class AppController {
    //Categories
    // [GET] /categories/:slug
    getOneCategory(req, res, next) {
        Category.findOne({slug: req.params.slug})
            .then((category) => {
                category = category.toObject();
                response(res, category, 'Lấy thành công 1 danh mục khoá học');
            })
            .catch(next => {
                error(res, 'Không thành công');
            });
    }

    //[GET] /categories/
    getAllCategories(req, res, next) {
        Promise.all([Category.find({}).sortable(req), Category.countDocumentsDeleted()])
            .then(([categories, deletedCount]) => {
                categories = categories.map(category => category.toObject());
                response(res, categories, 'Lấy thành công các danh mục khoá học');
            })
            .catch(next => {
                error(res, 'Không thành công');
            })
    }

    // [GET] trash/categories
    trashCategories(req, res, next) {
        Category.findDeleted({})
            .then(deletedCategories => {
                deletedCategories = deletedCategories.map(course => course.toObject());
                response(res, deletedCategories, 'Lấy thành công các danh mục đã xoá');
            })
            .catch(next => {
                error(res, 'Không thành công');
            });
    }


// [GET] /courses/:slug
    getOneCourse(req, res, next) {
        Course.findOne({slug: req.params.slug})
            .then((course) => {
                course = course.toObject();
                response(res, course, 'Lấy thành công 1 khoá học');

            })
            .catch(next => {
                error(res, 'Không thành công');
            });
    }

// [GET] /courses
    getAllCourses(req, res, next) {
        Promise.all([Course.find({}).populate('category', 'name'), Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => {
                courses = courses.map(course => course.toObject());
                response(res, courses, 'Lấy thành công tất cả khoá học');
            })
            .catch(next => {
                error(res, 'Không thành công');
            })
    }

// [GET] /trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then(deletedCourses => {
                deletedCourses = deletedCourses.map(course => course.toObject());
                response(res, deletedCourses, 'Lấy thành công tất cả khoá học đã xoá');
            })
            .catch(next => {
                error(res, 'Không thành công');
            })
    }
}


module.exports = new AppController();
