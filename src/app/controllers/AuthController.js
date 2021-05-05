const { response } = require('../lib/response');
const { error } = require('../lib/error');
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
                return response(res, 'Không tìm thấy username');
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Sai mật khẩu!"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var roles = [];
            for (let role of user.roles) {
                roles.push("ROLE_" + role.name.toUpperCase());
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: roles,
                accessToken: token
            });
        }
        catch (err) {
            error(res, 'Đăng nhập không thành công');
        }
    };
}

module.exports = new AuthController();