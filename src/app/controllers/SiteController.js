const Course = require("../models/Course");
const Category = require("../models/Category");
const Rate = require("../models/Rate");
const User = require("../models/User");
var bcrypt = require("bcryptjs");
class SiteController {
    // [GET] /home
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

    //[GET] / -> vao trang login
    login(req, res) {
        res.render("login");
    }

    // [GET] /report -> vao trang bao cao
    async report(req, res) {
        let categories = await Category.find({});
        categories = categories.map(c => {
            return {
                name: c.name,
                courseNumber: c.courseNumber
            }
        });

        let courses = await Course.find({});
        courses = courses.map(c => {
            return {
                cost: c.cost,
                level: c.level,
                lessonNumber: c.lessonNumber,
            }
        });

        let rates = await Rate.find({});
        rates = rates.map(c => c.rate);

        let rateOfCourses = await Course.find({});
        rateOfCourses = rateOfCourses.map(r => {
            return {
                name: r.name,
                rateAvg: r.rateAvg,
            }
        });

        //Báo cáo khoá học theo lượt Mua
        //get dsách user => lặp mỗi user lấy ra mảng courses cho vào mảng chính. Lặp qua mảng đó để count số lượng mỗi khoá học được bán
        let user = await User.find({}).populate(
            {
                path: "courses",
                populate: { path: "course", select: ["name"] },
            }
        );
        let boughtCourses = []; //mảng lưu danh danh sách các khoá học đc mua (có trùng)
        user.forEach(u => {
            boughtCourses.push(...(u.courses.map(c => c.course)));
        })

        let objCount = {}; // obj count số lượng mua của các khoá học ở trên
        boughtCourses.forEach(c => {
            objCount[c._id] = (objCount[c._id] || 0) + 1
        })
        let countedBought = [];
        for(let prop in objCount) {
            let name = boughtCourses.find(c => c._id == prop)['name'];
            countedBought.push({name, count: objCount[prop]});
        }
        res.render("report", {
            countedBought: JSON.stringify(countedBought),
            categories: JSON.stringify(categories),
            courses: JSON.stringify(courses),
            rates: JSON.stringify(rates),
            rateOfCourses: JSON.stringify(rateOfCourses),
        });
    }

    logout(req, res, next) {
        try {
            req.session.destroy();
            res.redirect('/');
        }
        catch (err) {
            next(err);
        }
    }
    //[POST] /signin -> dang nhap
    async signin(req, res, next) {
        try {
            let user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");
            if (!user) {
                res.json('Không tìm thấy username')
            }
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                res.json('Sai mật khẩu');
            }

            let roles = [];
            for (let role of user.roles) {
                roles.push("ROLE_" + role.name.toUpperCase());
            }
            user = {
                id: user._id,
                username: user.username,
                roles: roles,
            }
            req.session.user = user;
            res.redirect("/report");

        }
        catch (err) {
            res.redirect("back");
        }
    }
}

module.exports = new SiteController();
