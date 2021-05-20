const { error, error400 } = require('../lib/error');

async function isLoggedIn(req, res, next) {
    try {
        if(req.session.user){
            next();
            return;
        }
        res.redirect("/");
    }
    catch (err) {
        error(res, err);
    }
}

async function isModerator(req, res, next) {
    try {
        if(req.session.user.roles.includes('ROLE_MODERATOR')){
            next();
            return;
        }
        error400(res, "Bạn không phải mod");
    }
    catch (err) {
        error(res, err);
    }
}

async function isAdmin(req, res, next) {
    try {
        if(req.session.user.roles.includes('ROLE_ADMIN')){
            next();
            return;
        }
        error400(res, "Bạn không phải admin");
    }
    catch (err) {
        error(res, err);
    }
}

async function isModeratorOrAdmin(req, res, next) {
    try {
        if(req.session.user.roles.includes('ROLE_MODERATOR') || req.session.user.roles.includes('ROLE_ADMIN')){
            next();
            return;
        }
        error400(res, "Bạn cần quyền mod hoặc admin");
    }
    catch (err) {
        error(res, err);
    }
}
const auth = {
    isLoggedIn,
    isModerator,
    isAdmin,
    isModeratorOrAdmin

};
module.exports = auth;