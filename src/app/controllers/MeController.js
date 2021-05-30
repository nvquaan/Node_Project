const Course = require('../models/Course');
const Category = require('../models/Category');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const Role = require('../models/Role');

class MeController {
    //[GET] me/stored/courses
    async storedCourses(req, res, next) {
        try {
            let courses = await Course.find({}).populate('category', 'name');
            let deletedCount = await Course.countDocumentsDeleted();
            courses = courses.map(course => course.toObject());
            res.render('me/stored-courses', { deletedCount, courses });
        }
        catch (err) {
            next(err);
        }
    }

    //[GET] /me/trash/courses
    async trashCourses(req, res, next) {
        try {
            let deletedCourses = await Course.findDeleted({});
            deletedCourses = deletedCourses.map(course => course.toObject());
            res.render('me/trash-courses', { deletedCourses });
        }
        catch (err) {
            next(err);
        }
    }
    //[GET] me/stored/categories
    async storedCategories(req, res, next) {
        try {
            let categories = await Category.find({}).sortable(req);
            let deletedCount = await Category.countDocumentsDeleted();
            categories = categories.map(category => category.toObject());
            res.render('me/stored-categories', { deletedCount, categories });
        }
        catch (err) {
            next(err);
        }
    }

    //[GET] /me/trash/categories
    async trashCategories(req, res, next) {
        try {
            let deletedCategories = await Category.findDeleted({});
            deletedCategories = deletedCategories.map(course => course.toObject());
            res.render('me/trash-categories', { deletedCategories });
        }
        catch (err) {
            next(err);
        }
    }

    //[GET] me/stored/lessons
    async storedLessons(req, res, next) {
        try {
            let lessons = await Lesson.find({}).populate('course', 'name').sortable(req);
            let deletedCount = await Lesson.countDocumentsDeleted();
            lessons = lessons.map(category => category.toObject());
            res.render('me/stored-lessons', { deletedCount, lessons });
        }
        catch (err) {
            next(err);
        }
    }

    //[GET] /me/trash/lessons
    async trashLessons(req, res, next) {
        try {
            let deletedLessons = await Lesson.findDeleted({});
            deletedLessons = deletedLessons.map(course => course.toObject());
            res.render('me/trash-lessons', { deletedLessons });
        }
        catch (err) {
            next(err);
        }
    }

    // [GET] /me/stored/users
    async storedUsers(req, res, next) {
        try {
            let users = await User.find({}).populate("roles", "-__v").populate({
                path: 'courses',
                populate: { path: 'course', select: ['name'] }
            });
            let dataUser = users.map(user => user.toObject());
            dataUser.forEach(u => {
                u.roles = u.roles.map(r => r.name).join(',')
                u.courses = u.courses.length;
            })
            res.render('me/stored-users', { dataUser });
        }
        catch (err) {
            next(err);
        }
    }

    //[GET] /me/users/:id
    async editRoleUser(req, res, next) {
        try {
            let user = await User.findOne({ _id: req.params.id });
            if (req.body.role === 'admin') {
                let roles = await Role.find({ name: { $in: ['user', 'admin', 'moderator'] } });
                roles = roles.map(r => r._id);
                user.roles = roles;
            } else if (req.body.role === 'moderator') {
                let roles = await Role.find({ name: { $in: ['user', 'moderator'] } });
                roles = roles.map(r => r._id);
                user.roles = roles;
            } else if (req.body.role === 'user') {
                let roles = await Role.find({ name: { $in: ['user'] } });
                roles = roles.map(r => r._id);
                user.roles = roles;
            }
            await user.save();
            res.redirect('/me/stored/users');
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new MeController;
