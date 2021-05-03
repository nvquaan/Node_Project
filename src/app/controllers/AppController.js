const Category = require("../models/Category");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const { response } = require('../lib/response');
const { error } = require('../lib/error');

class AppController {
    //Categories
    // [GET] /categories/:slug
    async getOneCategory(req, res, next) {
        try {
            let category = await Category.findOne({ slug: req.params.slug });
            category = category.toObject();
            response(res, category, 'Lấy thành công 1 danh mục khoá học');
        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    //[GET] /categories/
    async getAllCategories(req, res, next) {
        try {
            let categories = await Category.find({}).sortable(req);
            // let deletedCount = Category.countDocumentsDeleted();
            categories = categories.map(category => category.toObject());
            response(res, categories, 'Lấy thành công các danh mục khoá học');
        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    // [GET] trash/categories
    async trashCategories(req, res, next) {
        try {
            let deletedCategories = await Category.findDeleted({});
            deletedCategories = deletedCategories.map(course => course.toObject());
            response(res, deletedCategories, 'Lấy thành công các danh mục đã xoá');
        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    //COURSES
    // [GET] /courses/:slug
    async getOneCourse(req, res, next) {
        try {
            let course = await Course.findOne({ slug: req.params.slug });
            course = course.toObject();
            response(res, course, 'Lấy thành công 1 khoá học');
        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    // [GET] /courses
    async getAllCourses(req, res, next) {
        try {
            let courses = await Course.find({}).populate('category', 'name');
            // let deletedCount = await Course.countDocumentsDeleted();
            courses = courses.map(course => course.toObject());
            response(res, courses, 'Lấy thành công tất cả khoá học');
        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    // [GET] /trash/courses
    async trashCourses(req, res, next) {
        try {
            let deletedCourses = await Course.findDeleted({});
            deletedCourses = deletedCourses.map(course => course.toObject());
            response(res, deletedCourses, 'Lấy thành công tất cả khoá học đã xoá');

        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    //LESSONS
    // [GET] /lessons/:slug
    async getOneLesson(req, res, next) {
        try {
            let lesson = await Lesson.findOne({ slug: req.params.slug });
            lesson = lesson.toObject();
            response(res, lesson, 'Lấy thành công 1 bài học');
        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    // [GET] /lessons
    async getAllLessons(req, res, next) {
        try {
            let lessons = await Lesson.find({}).populate('category', 'name');
            // let deletedCount = await Lesson.countDocumentsDeleted();
            lessons = lessons.map(lesson => lesson.toObject());
            response(res, lessons, 'Lấy thành công tất cả bài học');
        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

    // [GET] /trash/lessons
    async trashLessons(req, res, next) {
        try {
            let deletedLessons = await Lesson.findDeleted({});
            deletedLessons = deletedLessons.map(l => l.toObject());
            response(res, deletedLessons, 'Lấy thành công tất cả bài học đã xoá');

        }
        catch (err) {
            error(res, 'Không thành công');
        }
    }

}


module.exports = new AppController();
