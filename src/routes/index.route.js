const siteRouter = require('./site.route');
const courseRouter = require('./courses.route');
const categoryRouter = require('./categories.route');
const lessonRouter = require('./lessons.route');
const meRouter = require('./me.route');
const apiRouter = require('./api.route');
const { auth } = require("../app/middlewares");

function route(app){
    app.use('/me', [auth.isLoggedIn], meRouter);
    app.use('/courses', [auth.isLoggedIn], courseRouter);
    app.use('/categories', [auth.isLoggedIn], categoryRouter);
    app.use('/lessons', [auth.isLoggedIn], lessonRouter);
    app.use('/api', apiRouter);
    app.use('/', siteRouter);
    
}
module.exports = route;
