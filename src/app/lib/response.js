exports.getAllResponse = (res, data, message) => {
    res.status(200).json({
        success: true,
        message,
        code: 200,
        data,
    });
}

exports.createResponse = (res, message) => {
    res.status(201).json({
        message,
        success: true,
        code: 200,
    });
}

exports.updateResponse = (res, message) => {
    res.send({
        message,
        success: true,
        code: 200,
    });
}

exports.deleteResponse = (res, data, message) => {
    res.send({
        message,
        success: true,
        code: 200,
        data
    });
}

exports.getOneResponse = (res, data) => {
    res.send({
        success: true,
        code: 200,
        data
    });
}

exports.response = (res, message, data) => {
    // res.send({
    //     success: true,
    //     code: 200,
    //     message
    // });
    res.status(200).json({
        success: true,
        code: 200,
        message,
        data,
    });
}
