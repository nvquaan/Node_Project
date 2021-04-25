const Category = require("../models/Category");
const Course = require("../models/Course");
const {
    getAllResponse,
    createResponse,
    updateResponse,
    getOneResponse,
    response
} = require("../lib/response");
const {checkRoute} = require('../middlewares/CheckRoute');

class CategoryController {
    //[GET] /categories/:slug  Hien thi 1 danh muc
    show(req, res, next) {
        Category.findOne({slug: req.params.slug})
            .then((category) => {
              category = category.toObject();
                if(checkRoute(req)){
                  getOneResponse(res, category);
                }
                res.render("categories/show", {category, removeHeader: false});
            })
            .catch(next);
    }

    //[GET] categories/create  Vao trang tao moi
    create(req, res, next) {
        res.render("categories/create");
    }

    //[POST] categories/store  Thuc hien luu danh muc
    store(req, res, next) {
        const formData = {...req.body};
        const category = new Category(formData);
        category
            .save()
            .then(() => res.redirect("/me/stored/categories"))
            .catch((error) => {
            });
    }

    //[GET] /categories/:id/edit   Vao trang update danh muc
    edit(req, res, next) {
        Category.findById(req.params.id)
            .then((category) => {
              category = category.toObject();
                res.render("categories/edit", {category});
            })
            .catch(next);
    }

    //[PUT] /categories/:id    Update danh muc
    update(req, res, next) {
        let formData = {...req.body}
        formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        Category.updateOne({_id: req.params.id}, formData)
            .then(() => res.redirect("/me/stored/categories"))
            .catch(next);
    }

    //[DELETE] /categories/:id SOFT DELETE
    delete(req, res, next) {
        const categoryId = req.params.id;
        Course.delete({category: categoryId}) //Xoá các khoá học thuộc danh mục, sau đó xoá danh mục
            .then(() => {
                Category.delete({_id: categoryId})
                    .then(() => res.redirect("back"))
                    .catch(next);
            })
    }

    //[DELETE] /categories/:id DELETE
    forceDelete(req, res, next) {
        const categoryId = req.params.id;
        Course.deleteMany({category: categoryId})
            .then(() => {
                Category.deleteOne({_id: categoryId})
                    .then(() => res.redirect("back"))
                    .catch(next);
            })
    }

    //[PATCH] /categories/:id/restore Xoa danh muc
    restore(req, res, next) {
        const categoryId = req.params.id;
        Course.restore({category: categoryId}) //Xoá các khoá học thuộc danh mục, sau đó xoá danh mục
            .then(() => {
                Category.restore({_id: categoryId})
                    .then(() => res.redirect("back"))
                    .catch(next);
            })
    }

    //[POST] /categories/handle-form-actions
    handleFromActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                Category.delete({_id: {$in: req.body.courseIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: "Action is invalid"});
        }
    }
}

module.exports = new CategoryController();
