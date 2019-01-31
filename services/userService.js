const UserModel = require('../models/userModel')
const _ = require('lodash');

module.exports = {

    isAdmin(userId, callback) {
        UserModel.isAdmin(userId, (err, data) => {
            if (err) {
                callback(err);
            } else {
                if (data === 'ROLE_SADMIN') {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            }
        })

    },
    joinCreatedByWithProfilePic(notices, callback) {
        UserModel.getAllUsers((err, users) => {
            if (err) {
                callback(err)
            } else {
                for (let i = 0; i < notices.length; i++) {
                    let variable = _.find(users, (o) => {
                        return o.user_id == notices[i].createdby
                    })
                    notices[i].createdby = variable.first_name + ' ' + variable.last_name;
                    notices[i].profilePic = variable.profile_pic;
                    notices[i].email = variable.email_address;
                }
                callback(null, notices);
            }
        })
    },
    joinCreatedBy(notices, callback) {
        UserModel.getAllUsers((err, users) => {
            if (err) {
                callback(err)
            } else {
                for (let i = 0; i < notices.length; i++) {
                    let variable = _.find(users, (o) => {
                        return o.user_id == notices[i].createdby
                    })
                    notices[i].createdby = variable.first_name + ' ' + variable.last_name;
                }
                callback(null, notices);
            }
        })
    },
    joinCreatedByEmail(notices, callback) {
        UserModel.getAllUsers((err, users) => {
            if (err) {
                callback(err)
            } else {
                for (let i = 0; i < notices.length; i++) {
                    let variable = _.find(users, (o) => {
                        return o.user_id == notices[i].createdby
                    })
                    notices[i].createdby = variable.first_name + ' ' + variable.last_name;
                    notices[i].email = variable.email_address;
                }
                callback(null, notices);
            }
        })
    },
    joinSingleCreatedBy(data, callback) {
        UserModel.getSingleUser(data.createdby, (err, user) => {
            if (err) {
                callback(err);
            } else {
                data.createdby = user.first_name + ' ' + user.last_name;
                callback(null, data);
            }

        })
    },
    joinSingleCreatedByProfilePic(data, callback) {
        data.attendeesDetails = [];
        UserModel.getSingleUser(data.createdby, (err, user) => {
            if (err) {
                callback(err);
            } else {
                let promise = new Promise((resolve, reject) => {
                    console.log(data.attendees[0], 'data.attendeessssssssssssssssssssss')
                    if (data.attendees[0]) {
                        if (data.attendees[0].length > 0) {
                            UserModel.getAllUsers((err, users) => {
                                if (err) {
                                    reject(err);
                                }
                                for (let i = 0; i < data.attendees[0].length; i++) {
                                    let variable = _.find(users, (o) => {
                                        return o.email_address == data.attendees[0][i];
                                    })
                                    data.attendeesDetails.push({ profilePic: variable.profile_pic, name: variable.first_name + ' ' + variable.last_name })
                                }
                                resolve(data);
                            })
                        } else {
                            resolve(data);
                        }
                    } else {
                        resolve(data);
                    }

                })
                promise.then((resolveData) => {
                    resolveData.createdby = user.first_name + ' ' + user.last_name;
                    resolveData.profilePic = user.profile_pic;
                    callback(null, resolveData);
                }, (reason) => {
                    callback(reason);
                })
            }
        })
    },
    joinCreatedApprovedBy(notices, callback) {
        UserModel.getAllUsers((err, users) => {
            if (err) {
                callback(err);
            } else {
                for (let i = 0; i < notices.length; i++) {
                    let varriable = _.find(users, (o) => {
                        return o.user_id == notices[i].approvedby;
                    })
                    if (varriable) {
                        notices[i].approvedby = varriable.first_name + ' ' + varriable.last_name;
                    }
                }
                this.joinCreatedBy(notices, (err, data) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                    }
                })
            }
        })
    }
}