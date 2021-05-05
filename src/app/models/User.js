const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {type: String},
        email: {type: String},
        password: {type: String},
        roles: [{
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Role'
        }]
    }
);


module.exports = mongoose.model("User", UserSchema);
