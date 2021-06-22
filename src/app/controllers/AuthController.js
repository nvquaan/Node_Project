const { response } = require('../lib/response');
const { error, error400 } = require('../lib/error');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/db/auth.config");
const sendEmail = require("../../helper/sendEmail");

const User = require("../models/User");
const Role = require("../models/Role");

let randomNum;
class AuthController {
    async signup(req, res, next) {
        try {
            let formData = req.body;
            formData.password = bcrypt.hashSync(req.body.password, 8);
            const user = new User({
                ...formData
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
            let confirmToken = jwt.sign({ email: req.body.email }, config.secret);
            let dataEmail = {
                email: req.body.email,
                fullname: req.body.fullname,
                token: confirmToken,
            }
            sendEmail.emailVerifyToken(dataEmail);
        }
        catch (err) {
            error(res, 'Đăng ký không thành công');
        }
    };

    async verifySignup(req, res, next) {
        try {
            let confirmToken = req.query.confirmToken;
            jwt.verify(confirmToken, config.secret, (err, decoded) => {
                if (err) {
                    return res.json({
                        code: 401,
                        success: false,
                        message: 'Có lỗi xảy ra',
                        data: null,
                    })
                }
                req.body.email = decoded.email;
                response(res, 'Xác nhận email thành công');
            });
            let user = await User.findOne({ email: req.body.email });
            user.verified = true;
            await user.save();
        }
        catch (err) {
            error(res, 'Có lỗi xảy ra');
        }
    }
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
                return error400(res, 'Sai mật khẩu!');

            }
            let token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            // req.session.user = user;

            let roles = [];
            for (let role of user.roles) {
                roles.push("ROLE_" + role.name.toUpperCase());
            }
            response(res, 'Đăng nhập thành công', {
                id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                age: user.age,
                gender: user.gender,
                wallet: user.wallet,
                phone: user.phone,
                roles: roles,
                courses: user.courses,
                verified: user.verified,
                accessToken: token
            })
        }
        catch (err) {
            error(res, 'Đăng nhập không thành công');
        }
    };

    async forgetPassword(req, res, next) {
        try {
            let user = await User.findOne({ username: req.body.username });
            if (!user) {
                return error400(res, 'Không tìm thấy usernames');
            }
            if (user && req.body.step === 1) {
                randomNum = Math.floor(Math.random() * 10000) + 1000;
                let dataEmail = {
                    user: {
                        fullname: user.fullname,
                        username: user.username,
                        email: user.email
                    },
                    randomNum: randomNum
                }
                sendEmail.emailVerifyNumber(dataEmail);
                return response(res, 'Kiểm tra email để nhận mã xác thực');
            }
            if (user && req.body.step === 2) {
                if (!req.body.verifyNumber) {
                    return error400(res, 'Mã xác thực không hợp lệ');
                }
                if (randomNum != +req.body.verifyNumber) {
                    return error400(res, 'Mã xác thực không hợp lệ');
                } else {
                    return response(res, 'Nhập mật khẩu mới');
                }
            }
            if (user && req.body.step === 3) {
                let user = await User.findOne({ username: req.body.username });
                user.password = bcrypt.hashSync(req.body.newPassword, 8);
                await user.save();
                return response(res, 'Đổi mật khẩu thành công');
            }
        }
        catch (err) {
            next(err);
        }
    }

    async checkSignin(req, res, next) {
        try {
            let user = await User.findOne({ username: req.params.slug }).populate("roles", "-__v").populate({
                path: 'courses',
                populate: { path: 'course', select: ['name', 'imageUrl', 'cost', 'slug'] }
            });
            let roles = [];
            for (let role of user.roles) {
                roles.push("ROLE_" + role.name.toUpperCase());
            }
            response(res, 'Verify thành công', {
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                age: user.age,
                gender: user.gender,
                wallet: user.wallet,
                phone: user.phone,
                roles: roles,
                courses: user.courses,
                verified: user.verified,
            });
        }
        catch (err) {
            error(res, 'Có lỗi xảy ra!');
        }
    }
    async editUser(req, res, next) {
        try {
            let user = await User.findOne({ username: req.body.username });
            if (!user) {
                return error400(res, 'Không tìm thấy username');
            }
            user.fullname = req.body.fullname;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.phone = req.body.phone;
            if (req.body.oldPassword && req.body.newPassword) {
                let passwordIsValid = bcrypt.compareSync(
                    req.body.oldPassword,
                    user.password
                );
                if (!passwordIsValid) {
                    return error400(res, 'Mật khẩu cũ không chính xác');
                } else {
                    user.password = bcrypt.hashSync(req.body.newPassword, 8);
                }
            }
            await user.save();
            response(res, 'Đổi thông tin thành công!');
            console.log(req.body);
        }
        catch (err) {
            error(res, 'Có lỗi xảy ra');
        }
    }
}

module.exports = new AuthController();
//test