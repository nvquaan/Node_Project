exports.error = (res, message) => {
    return res.send({
        code: 500,
        success: false,
        message,
        data: null,
    })
}
