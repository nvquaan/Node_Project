const Category = require("../models/Category");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
class CategoryController {
    //[GET] /categories/:slug  Hien thi 1 danh muc
    async showCategory(req, res, next) {
        try {
            let category = await Category.findOne({ slug: req.params.slug });
            category = category.toObject();
            res.render("categories/show", { category, removeHeader: false });
        } catch (err) {
            next(err);
        }
    }

    //[GET] categories/create  Vao trang tao moi
    create(req, res, next) {
        res.render("categories/create");
    }

    //[POST] categories/store  Thuc hien luu danh muc
    async store(req, res, next) {
        try {
            const formData = { ...req.body };
            const category = new Category(formData);
            await category.save();
            res.redirect("/me/stored/categories");
        } catch (err) {
            next(err);
        }
    }

    //[GET] /categories/:id/edit   Vao trang update danh muc
    async edit(req, res, next) {
        try {
            let category = await Category.findById(req.params.id);
            category = category.toObject();
            res.render("categories/edit", { category });
        } catch (err) {
            next(err);
        }
    }

    //[PUT] /categories/:id    Update danh muc
    async update(req, res, next) {
        try {
            let formData = { ...req.body };
            await Category.updateOne({ _id: req.params.id }, formData);
            res.redirect("/me/stored/categories");
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /categories/:id SOFT DELETE
    async delete(req, res, next) {
        try {
            const categoryId = req.params.id;
            let courses = await Course.find({ category: categoryId });
            courses = courses.map(c => c.toObject());
            await Lesson.delete({ course: { $in: courses } });
            await Course.delete({ category: categoryId });
            await Category.delete({ _id: categoryId });
            res.redirect("back");
        }
        catch (err) {
            next(err);
        }
    }

    //[DELETE] /categories/:id DELETE
    async forceDelete(req, res, next) {
        try {
            const categoryId = req.params.id;
            let courses = await Course.findWithDeleted({ category: categoryId });
            courses = courses.map(c => c.toObject());
            await Lesson.deleteOne({ course: { $in: courses } })
            await Course.deleteMany({ category: categoryId });
            await Category.deleteOne({ _id: categoryId });
            res.redirect("back")

        }
        catch (err) {
            next(err);
        }
    }

    //[PATCH] /categories/:id/restore Xoa danh muc
    async restore(req, res, next) {
        const categoryId = req.params.id;
        try {
            await Course.restore({ category: categoryId });
            await Category.restore({ _id: categoryId });
            res.redirect("back");
        }
        catch (err) {
            next(err);
        }
    }

    //[POST] /categories/handle-form-actions
    async handleFromActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                try {
                    await Course.delete({ _id: { $in: req.body.categoryIds } });
                    res.redirect("back");
                } catch (err) {
                    next(err);
                }
                break;
            default:
                res.json({ message: "Action is invalid" });
        }
    }
}

module.exports = new CategoryController();
