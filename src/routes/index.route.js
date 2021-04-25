const siteRouter = require('./site.route');
const courseRouter = require('./courses.route');
const categoryRouter = require('./categories.route');
const meRouter = require('./me.route');

function route(app){
    app.use('/:api?/me', meRouter);
    app.use('/:api?/courses', courseRouter);
    app.use('/:api?/categories', categoryRouter)
    app.use('/:api?/', siteRouter);
    
}
module.exports = route;
