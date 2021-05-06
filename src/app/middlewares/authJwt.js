const jwt = require("jsonwebtoken");
const config = require("../../config/db/auth.config");
const User = require('../models/User');
const Role = require('../models/Role');
const { response } = require('../lib/response');
const { error, error400 } = require('../lib/error');
function verifyToken(req, res, next) {
    let token = req.headers["x-access-token"];

    if (!token) {
        error400(res, "No token provided!");
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            error400(res, "Unauthorized");
        }
        req.userId = decoded.id;
        next();
    });
};

async function isAdmin(req, res, next) {
    try {
        let user = await User.findById(req.userId);
        let roles = await Role.find({ _id: { $in: user.roles } });
        for (let role of roles) {
            if (role.name === "admin") {
                next();
                return;
            }
        }
        error400(res, "Require Admin Role!");
    }
    catch (err) {
        error(res, err);
    }
};

async function isModerator(req, res, next) {
    try {
        let user = await User.findById(req.userId);
        let roles = await Role.find({ _id: { $in: user.roles } });
        for (let role of roles) {
            if (role.name === "moderator") {
                next();
                return;
            }
        }
        error400(res, "Require Moderator Role!");
    }
    catch (err) {
        error(res, err);
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;