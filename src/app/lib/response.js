
exports.response = (res, message, data) => {
    res.status(200).json({
        success: true,
        code: 200,
        message,
        data,
    });
}
