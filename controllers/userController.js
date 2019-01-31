const UserModel = require('../models/userModel');
const MailService = require('../services/mailService');
const UserService = require('../services/userService');

module.exports = {
    googleLogin(req, res) {
        UserModel.isUserExists(req.body.email, (err, data) => {
            if (err) {
                res.status(500).json({ message: err });
                res.end();
            }
            else if (data) {
                data.name = data.first_name + " " + data.last_name;
                req.session.user = data.user_id;
                req.session.save();
                res.status(200).json(data);
                res.end();
            } else {
                res.status(401).json({ 'message': 'Unautherized User' })
                res.end();
            }
        })
    },
    logout(req, res) {
        res.clearCookie('user_id');
        res.status(200);
        res.end();

    },
    getUserListWithEmail(req, res) {
        UserModel.getUserListWithEmail((err, emails) => {
            if (err) {
                res.status(500).json({ message: err });
                res.end();
            } else {
                res.status(200).json(emails);
                res.end();
            }
        })
    }
}