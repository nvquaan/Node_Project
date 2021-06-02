const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {type: String},
        email: {type: String},
        fullname: {type: String},
        age: {type: Number},
        gender: {type: String},
        phone: {type: Number},
        password: {type: String},
        roles: [{
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Role'
        }],
        courses: [{
            course: {
                type: mongoose.Schema.Types.ObjectID,
                ref: 'Course',
            },
            date: {type: String, default:''},
        }],
        wallet: {type: Number, default: 10000000},
        verified: {type: Boolean, default:false},
    }
);


module.exports = mongoose.model("User", UserSchema);
