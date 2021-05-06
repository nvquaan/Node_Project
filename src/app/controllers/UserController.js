const { response } = require('../lib/response');
const { error } = require('../lib/error');
class UserController {
    allAccess(req, res) {
        res.status(200).json("Public Content.");
    };

    userBoard(req, res) {
        res.status(200).json("User Content.");
    };

    adminBoard(req, res) {
        res.status(200).json("Admin Content.");
    };

    moderatorBoard(req, res) {
        res.status(200).json("Moderator Content.");
    };
}

module.exports = new UserController();