exports.checkRoute = function (req) {
    return req.baseUrl.includes('/api')?true:false;
}
