const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete"); //Soft delete

const CategorySchema = new Schema(
    {
        name: {type: String},
        description: String,
        imageUrl: {type: String},
        slug: {type: String, slug: "name", unique: true},
    },
    {
        timestamps: true,
    }
);

//Custom query helpers
CategorySchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty("_sort")) {
        const isValidType = ["asc", "desc"].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : "desc",
        });
    }
    return this;
};

//Add plugins
CategorySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

mongoose.plugin(slug);

module.exports = mongoose.model("Category", CategorySchema);
