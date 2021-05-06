const { response } = require('../lib/response');
const { error } = require('../lib/error');
class UserController {
    allAccess(req, res) {
        res.status(200).send("Public Content.");
    };

    userBoard(req, res) {
        res.status(200).json("User Content.");
    };

    adminBoard(req, res) {
        res.status(200).send("Admin Content.");
    };

    moderatorBoard(req, res) {
        res.status(200).send("Moderator Content.");
    };
}

module.exports = new UserController();