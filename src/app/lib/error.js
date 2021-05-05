exports.error = (res, message) => {
    return res.send({
        code: 500,
        success: false,
        message,
        data: null,
    })
}

exports.error400 = (res, message) => {
    return res.send({
        code: 400,
        success: false,
        message,
        data: null,
    })
}