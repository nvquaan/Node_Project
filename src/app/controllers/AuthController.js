const { response } = require('../lib/response');
const { error, error400 } = require('../lib/error');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../../config/db/auth.config");

const User = require("../models/User");
const Role = require("../models/Role");

class AuthController {
    async signup(req, res) {
        try {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8)
            });
            if (req.body.roles) {
                let roles = await Role.find({ name: { $in: req.body.roles } });
                user.roles = roles.map(r => r._id);
            } else {
                let role = await Role.findOne({ name: "user" });
                user.roles = [role._id];
            }
            await user.save();
            response(res, 'Đăng ký thành công');
        }
        catch (err) {
            error(res, 'Đăng ký không thành công');
        }
    };
    async signin(req, res) {
        try {
            let user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");
            if (!user) {
                return error400(res, 'Không tìm thấy username');
            }
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).json({
                    success: false,
                    accessToken: null,
                    message: "Sai mật khẩu!"
                });
            }
            let token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            let roles = [];
            for (let role of user.roles) {
                roles.push("ROLE_" + role.name.toUpperCase());
            }
            response(res, 'Đăng nhập thành công', {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: roles,
                accessToken: token
            })
        }
        catch (err) {
            error(res, 'Đăng nhập không thành công');
        }
    };
    checkSignin(req, res, next){
        try {
            response(res, 'Verify thành công');
        }
        catch (err){
            next(err);
        }
    }
}

module.exports = new AuthController();