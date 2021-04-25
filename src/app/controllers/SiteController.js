const Course = require("../models/Course");
const {
    getAllResponse,
    createResponse,
    updateResponse,
    getOneResponse,
    response
} = require("../lib/response");
const {checkRoute} = require('../middlewares/CheckRoute');

class SiteController {
    // [GET] /
    home(req, res, next) {
        Course.find({})
            .then((courses) => {
                courses = courses.map((course) => course.toObject());
                if (checkRoute(req)) {
                    getAllResponse(res, courses)
                } else
                    res.render("home", {courses, showTitle: true, showFooter: true})
            })
            .catch(next);
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
