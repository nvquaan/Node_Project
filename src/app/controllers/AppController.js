const Category = require("../models/Category");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Rate = require("../models/Rate");
const User = require("../models/User");
const { response } = require("../lib/response");
const { error } = require("../lib/error");
class AppController {
    //Categories
    // [GET] /categories/:slug
    async getOneCategory(req, res, next) {
        try {
            let category = await Category.findOne({ slug: req.params.slug });
            category = category.toObject();
            response(res, "Lấy thành công 1 danh mục khoá học", category);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    //[GET] /categories/:slug/courses
    async getAllCoursesOfCategory(req, res, next){
        try {
            let category = await Category.findOne({ slug: req.params.slug });
            let courses = await Course.find({category: category._id});
            courses = courses.map(c=>c.toObject());
            response(res, "Lấy thành công các khoá học thuộc danh mục", courses);
        }
        catch (err) {
            error(res, "Lấy các khoá học thuộc danh mục không thành công")
        }
    }
    //[GET] /categories/
    async getAllCategories(req, res, next) {
        try {
            let categories = await Category.find({}).sortable(req);
            // let deletedCount = Category.countDocumentsDeleted();
            categories = categories.map((category) => category.toObject());
            response(res, "Lấy thành công các danh mục khoá học", categories);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    // [GET] trash/categories
    async trashCategories(req, res, next) {
        try {
            let deletedCategories = await Category.findDeleted({});
            deletedCategories = deletedCategories.map((course) => course.toObject());
            response(res, "Lấy thành công các danh mục đã xoá", deletedCategories);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    //COURSES
    // [GET] /courses/:slug/lessons/
    async getAllLessonsOfCourse(req, res, next) {
        try {
            const courseId = await Course.findOne({ slug: req.params.slug });
            let lesson = await Lesson.find({ course: courseId });
            lesson = lesson.map((l) => l.toObject());
            response(res, "Lấy thành công", lesson);
        } catch (err) {
            error(res, "Không thành công");
        }
    }
    // [GET] /courses/:slug
    async getOneCourse(req, res, next) {
        try {
            let course = await Course.findOne({ slug: req.params.slug }).populate(
                "category",
                "name"
            );
            course = course.toObject();
            response(res, "Lấy thành công 1 khoá học", course);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    // [GET] /courses
    async getAllCourses(req, res, next) {
        try {
            let courses = await Course.find({}).populate("category", "name");
            // let deletedCount = await Course.countDocumentsDeleted();
            courses = courses.map((course) => course.toObject());
            response(res, "Lấy thành công tất cả khoá học", courses);
        } catch (err) {
            error(res, "Lấy tất cả khoá học không thành công");
        }
    }

    //[GET] /courses/hot
    async getAllHotCourse(req, res, next) {
        try {
            let courses = await Course.find({}).populate("category", "name");
            courses = courses.map((course) => course.toObject());
            courses = courses.sort((a, b) => b.rateAvg - a.rateAvg);
            response(res, "Lấy thành công tất cả khoá học HOT", courses);
        } catch (err) {
            error(res, "Lấy tất cả khoá học HOT không thành công");
        }
    }

    //[POST] /courses/search
    async searchCourses(req, res, next) {
        try {
            let str = req.body.searchStr
            let courses = await Course.find({ name: { $regex: str, $options: "i" } }).populate("category", "name");
            courses = courses.map(c => c.toObject());
            response(res, "Tìm kiếm khoá học thành công!", courses);
        } catch (err) {
            error(res, "Tìm kiếm khoá học không thành công!");
        }
    }

    // [GET] /trash/courses
    async trashCourses(req, res, next) {
        try {
            let deletedCourses = await Course.findDeleted({});
            deletedCourses = deletedCourses.map((course) => course.toObject());
            response(res, "Lấy thành công tất cả khoá học đã xoá", deletedCourses);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    //[GET] /courses/rate/:slug
    async getAllRates(req, res, next) {
        try {
            let course = await Course.findOne({ slug: req.params.slug });
            let rates = await Rate.find({ course: course._id })
                .populate("course", "slug")
                .populate("user", "username");
            response(res, "Lấy thành công tất cả đánh giá của khoá học", rates);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    //[PUT] /courses/rate/:slug
    //vote lần đầu tiên -> thêm vào csdl id khoá học, id user, nội dung bình luận
    async rateCourse(req, res, next) {
        try {
            let course = await Course.findOne({ slug: req.params.slug });
            let rate = await new Rate({
                ...req.body,
                course: course._id,
            });
            await rate.save();
            updateRateAvgOfCourse(req.params.slug);
            response(res, "Vote thành công");
        } catch (err) {
            error(res, "Vote không thành công");
        }
    }

    //[PUT] /courses/rate-edit/:slug
    async updateRateCourse(req, res, next) {
        try {
            let rateData = await Rate.findOne({ _id: req.body._id });
            rateData.rate = req.body.rate;
            rateData.message = req.body.message;
            await rateData.save();
            updateRateAvgOfCourse(req.params.slug);
            response(res, "Update vote thành công");
        } catch (err) {
            error(res, "Update vote không thành công");
        }
    }

    //[DELETE] /courses/rate/:slug/:id
    async deleteRateCourse(req, res, next) {
        try {
            await Rate.deleteOne({ _id: req.params.id });
            updateRateAvgOfCourse(req.params.slug);
            response(res, "Xoá vote thành công");
        } catch (err) {
            error(res, "Xoá vote không thành công");
        }
    }

    //[POST] /courses/buy
    async buyCourses(req, res, next) {
        try {
            let user = await User.findOne({ username: req.body.username });
            req.body.coursesId.forEach((id) => {
                user.courses.push({
                    course: id,
                    date: req.body.date,
                });
            });

            user.wallet -= req.body.total;
            await user.save();
            let result = await User.findOne({ username: req.body.username }).populate(
                {
                    path: "courses",
                    populate: { path: "course", select: ["name", "imageUrl", "cost", 'slug'] },
                }
            );
            response(res, "Mua thành công", result);
        } catch (err) {
            error(res, "Mua không thành công");
        }
    }

    //LESSONS
    // [GET] /lessons/:slug
    async getOneLesson(req, res, next) {
        try {
            let lesson = await Lesson.findOne({ slug: req.params.slug });
            lesson = lesson.toObject();
            response(res, "Lấy thành công 1 bài học", lesson);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    // [GET] /lessons
    async getAllLessons(req, res, next) {
        try {
            let lessons = await Lesson.find({}).populate("category", "name");
            // let deletedCount = await Lesson.countDocumentsDeleted();
            lessons = lessons.map((lesson) => lesson.toObject());
            response(res, "Lấy thành công tất cả bài học", lessons);
        } catch (err) {
            error(res, "Không thành công");
        }
    }

    // [GET] /trash/lessons
    async trashLessons(req, res, next) {
        try {
            let deletedLessons = await Lesson.findDeleted({});
            deletedLessons = deletedLessons.map((l) => l.toObject());
            response(res, "Lấy thành công tất cả bài học đã xoá", deletedLessons);
        } catch (err) {
            error(res, "Không thành công");
        }
    }
}

//tính trung bình rate của khoá học: lấy tất cả các rates có idcourse -> tính trung bình
async function updateRateAvgOfCourse(slug) {
    let course = await Course.findOne({ slug: slug });
    let rates = await Rate.find({ course: course._id });
    if (rates.length > 0) {
        rates = rates.map((r) => r.toObject());
        let rateAvg = rates.reduce((value, item) => {
            return value + item.rate;
        }, 0);
        course.rateAvg = +(rateAvg / rates.length).toFixed(1);
    } else {
        course.rateAvg = 0;
    }
    await course.save();
}
module.exports = new AppController();
