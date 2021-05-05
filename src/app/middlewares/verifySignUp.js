const ROLES = ['user', 'admin', 'moderator'];
const User = require('../models/User');
// const { response } = require('../lib/response');
const { error, error400 } = require('../lib/error');
async function checkDuplicateUsernameOrEmail(req, res, next) {
    try {
        let username = await User.findOne({ username: req.body.username });
        if (username) {
            error400(res, "Failed! Username is already in use!");
            return;
        }
        let email = await User.findOne({ email: req.body.email });
        if (email) {
            error400(res, "Failed! Email is already in use!");
            return;
        }
        next();
    }
    catch (err) {
        error(res, err);
    }
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let role of req.body.roles) {
            if (!ROLES.includes(role)) {
                error400(res, `Failed! Role ${role} does not exist!`);
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;