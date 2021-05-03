const Course = require("../models/Course");

class SiteController {
    // [GET] /
    async getAllCourses(req, res, next) {
        try {
            let courses = await Course.find({});
            courses = courses.map((course) => course.toObject());
            res.render("home", { courses });
        }
        catch (err) {
            next(err);
        }
    }

    //[GET] /search
    search(req, res) {
        res.render("search");
    }

    //[GET] /login
    login(req, res) {
        res.render("login");
    }
}

module.exports = new SiteController();
