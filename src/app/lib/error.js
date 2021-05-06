exports.error = (res, message) => {
    return res.json({
        code: 500,
        success: false,
        message,
        data: null,
    })
}

exports.error400 = (res, message) => {
    return res.json({
        code: 400,
        success: false,
        message,
        data: null,
    })
}