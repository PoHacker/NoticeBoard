const joi = require('joi');


function validate(body, schema, next, res) {
    joi.validate(body, schema, (err, result) => {
        if (err) {
            res.status(400).json({ message: err.message })
        } else {
            next();
        }
    })
}




module.exports = {
    // singleIdValidator(req, res, next) {
    //     let schema = {
    //         id: joi.number().required
    //     }
    //     validate(req.params, schema, next, res);
    // },
    approveNotice(req, res, next) {
        let schema = {
            id: joi.number().required(),
            email: joi.string().email().required(),
            approvedDate: joi.date().required()

        }
        validate(req.body, schema, next, res);
    },
    editNotice(req, res, next) {
        let schema = {
            id: joi.number().required(),
            title: joi.string().max(20).required(),
            description: joi.string().required()
        }
        let data = {
            id: req.params.id,
            title: req.body.title,
            description: req.body.description,
        }
        validate(data, schema, next, res);
    },
    editComment(req, res, next) {
        let schema = {
            comment: joi.string().required(),
            id: joi.number().required()
        }
        let data = {
            comment: req.body.comment,
            id: req.params.id
        }
        validate(data, schema, next, res);
    },
    deleteValidator(req, res, next) {
        let schema = {
            id: joi.number().required(),
        }
        validate(req.params, schema, next, res);
    },
    updateUser(req, res, next) {
        let schema = {
            email: joi.string().email().required(),
            name: joi.string().required(),
            role: joi.string().required()
        }
        validate(req.body, schema, next);
    },
    addComment(req, res, next) {
        let schema = {
            comment: joi.string().required(),
            noticeId: joi.number().required(),
            creationDate: joi.date().required()
        }
        validate(req.body, schema, next, res);
    },
    // getUser(req,res,next){
    //     let schema = {

    //     }
    // },
    deleteUser(req, res, next) {
        let schema = {
            id: joi.number().required()
        }
        validate(req.params, schema, next, res);
    },

    singleIdValidator(req, res, next) {
        let schema = {
            id: joi.number().required()
        }
        validate(req.params, schema, next, res);
    },

    addNotice(req, res, next) {
        let schema = {
            title: joi.string().max(30).required(),
            description: joi.string().required(),
            createdAt: joi.date().required(),
            type: joi.string(),
        }
        validate(req.body, schema, next, res);
    },

    otpGeneration(req, res, next) {
        let schema = {
            email: joi.string().email().required()
        }
        validate(req.body, schema, next, res);

    },

    userRegistration(req, res, next) {
        let schema = {
            name: joi.string().max(50).required(),
            email: joi.string().email().required(),
            password: joi.string().min(6).max(20).required(),
            otp: joi.number().min(1000).max(9999).required()
        }
        validate(req.body, schema, next, res);

    },

    login(req, res, next) {
        let schema = {
            email: joi.string().email().required(),
            password: joi.string().min(6).max(18).required()
        }
        validate(req.body, schema, next, res);

    },

    googleLogin(req, res, next) {
        let schema = {
            email: joi.string().email().required(),
        }
        validate(req.body, schema, next, res);

    },
    addEvent(req, res, next) {
        let schema = {
            title: joi.string().max(30).required(),
            description: joi.string().required(),
            createdAt: joi.date().required(),
            start: joi.date(),
            end: joi.date(),
            attendees: joi.any(),
            location: joi.any(),
            type: joi.string()
        }
        validate(req.body, schema, next, res);
    }
}