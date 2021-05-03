const siteRouter = require('./site.route');
const courseRouter = require('./courses.route');
const categoryRouter = require('./categories.route');
const lessonRouter = require('./lessons.route');
const meRouter = require('./me.route');
const apiRouter = require('./api.route');
function route(app){
    app.use('/me', meRouter);
    app.use('/courses', courseRouter);
    app.use('/categories', categoryRouter);
    app.use('/lessons', lessonRouter);
    app.use('/api', apiRouter);
    app.use('/', siteRouter);
    
}
module.exports = route;
