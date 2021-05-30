let nodemailer = require('nodemailer');

const configTransporter = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: '587',
    auth: {
        user: 'kbsatest@gmail.com',
        pass: 'wjmhtwbrcptlzvrw'
    }
}
const transporter = nodemailer.createTransport(configTransporter);

function emailBought(dataEmail) {
    dataEmail.courses = dataEmail.courses.map(c => {
        return `<li>${c.name} - Giá: <b>${c.cost}</b></li>`
    }).join('');
    

    let mailOptions = {
        from: 'kbsatest@gmail.com',
        to: dataEmail.user.email,
        subject: 'Cảm ơn bạn đã mua khoá học',
        html: `<h2>Thân gửi ${dataEmail.user.fullname}</h2>
        <h4>Tài khoản đăng nhập: ${dataEmail.user.username}</h4>
        <p>Danh sách khoá học đã mua:</p>
        <ul>
            ${dataEmail.courses}
        </ul>
        <h4>Tổng thanh toán: <b>${dataEmail.total}</b></h4>
        <h4>Số dư còn lại: <b>${dataEmail.user.wallet}</b></h4>
        <p>Cảm ơn bạn đã mua các khoá học của chúng tôi. Hi vọng bạn có những trải nghiệm vui vẻ!</p>

        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function emailVerifyNumber(dataEmail){
    let mailOptions = {
        from: 'kbsatest@gmail.com',
        to: dataEmail.user.email,
        subject: 'Yêu cầu lấy lại mật khẩu',
        html: `<h2>Thân gửi ${dataEmail.user.fullname}</h2>
        <h4>Tài khoản đăng nhập: ${dataEmail.user.username}</h4>
        <p>Bạn đã yêu cầu lấy lại mật khẩu. Hãy nhập mã xác thực dưới đây để đổi mật khẩu mới</p>
        <h4>MÃ XÁC THỰC: <b>${dataEmail.randomNum}</b></h4>
        <p>Vui lòng không tiết lộ mã xác thực với bất kỳ ai</p>

        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendEmail = {
    emailBought,
    emailVerifyNumber
};

module.exports = sendEmail;