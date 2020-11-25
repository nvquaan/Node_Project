const Course = require('../models/Course');

class SiteController{
    // [GET] /
    home(req, res, next){
        Course.find({})
      .then((courses) => {
        courses = courses.map((course) => course.toObject());
        res.render("home", { courses, showTitle: true, showFooter: true });
      })
      .catch(next);
    }

    //[GET] /search
    search(req, res){
        res.render('search');
    }
}

module.exports = new SiteController;