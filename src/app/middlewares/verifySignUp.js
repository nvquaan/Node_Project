const ROLES = ['user', 'admin', 'moderator'];
const User = require('../models/User');
// const { response } = require('../lib/response');
const { error, error400 } = require('../lib/error');
async function checkDuplicateUsernameOrEmail(req, res, next) {
    try {
        let username = await User.findOne({ username: req.body.username });
        if (username) {
            error400(res, "Username đã tồn tại!");
            return;
        }
        let email = await User.findOne({ email: req.body.email });
        if (email) {
            error400(res, "Email đã tồn tại");
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

async function isVerified(req, res, next) {
    try {
        let user = await User.findOne({ username: req.body.username });
        if(!user){
            return error(res, 'Không tìm thấy username');
        }
        if(!user.verified){
            return error(res, 'Tài khoản chưa xác nhận email');
        }
        next();
    }
    catch (err) {
        error(res, err);
    }
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
    isVerified
};

module.exports = verifySignUp;