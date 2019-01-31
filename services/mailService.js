const nodemailer = require('nodemailer');
const emailAuth = require('../config/config.json')['emailAuth'];
const senderEmail = require('../config/config')['senderEmail'];

module.exports = { sendMail };

function sendMail(email, body,subject, callback) {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: emailAuth
    });

    let mailOptions = {
        from: senderEmail,
        to: email,
        subject: subject,
        text: body
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            callback(err);
        } else {
            callback(null, info);
        }
    })
}
