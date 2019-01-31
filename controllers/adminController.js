const UserModel = require('../models/userModel');
const UserService = require('../services/userService');
const AdminModel = require('../models/adminModel');
const MailSerive = require('../services/mailService');
const NoticeModel = require('../models/noticeModels');
const noticeService = require('../services/noticeService');
const moment = require('moment');


module.exports = {
    searchPendtionNotices(req, res) {
        UserService.isAdmin(req.session.user, (err, admin) => {
            if (err) {
                res.status(500).json(err);
                res.end();
            } else if (admin) {
                AdminModel.searchPendingNotices(req.params.str, (err, data) => {
                    if (err) {
                        res.status(500).json(err);
                        res.end();
                    } else {
                        res.status(200).json(data);
                    }
                })
            } else {
                res.status(401).json({ message: 'Not an Admin' });
            }
        })
    },
    searchApprovedNotices(req, res) {
        UserService.isAdmin(req.session.user, (err, admin) => {
            if (err) {
                res.status(500).json(err);
                res.end();
            } else if (admin) {
                AdminModel.searchApprovedNotices(req.params.str, (err, data) => {
                    if (err) {
                        res.status(500).json(err);
                        res.end();
                    } else {
                        res.status(200).json(data);
                    }
                })
            } else {
                res.status(401).json({ message: 'Not an Admin' });
            }
        })
    },
    searchArchivedNotices(req, res) {
        UserService.isAdmin(req.session.user, (err, admin) => {
            if (err) {
                res.status(500).json(err);
                res.end();
            } else if (admin) {
                AdminModel.searchArchivedNotices(req.params.str, (err, data) => {
                    if (err) {
                        res.status(500).json(err);
                        res.end();
                    } else {
                        res.status(200).json(data);
                    }
                })
            } else {
                res.status(401).json({ message: 'Not an Admin' });
            }
        })
    },
    searchEvents(req, res) {
        UserService.isAdmin(req.session.user, (err, admin) => {
            if (err) {
                res.status(500).json(err);
                res.end();
            } else if (admin) {
                AdminModel.searchEvents(req.params.str, (err, data) => {
                    if (err) {
                        res.status(500).json(err);
                        res.end();
                    } else {
                        res.status(200).json(data);
                    }
                })
            } else {
                res.status(401).json({ message: 'Not an Admin' });
            }
        })
    },
    addEvent(req, res) {
        req.body.createdBy = req.session.user;
        UserService.isAdmin(req.session.user, callback);
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err });
            } else if (isAdmin) {
                let eventValue = {
                    summary: req.body.title,
                    start: {
                        dateTime: req.body.start
                    },
                    end: {
                        dateTime: req.body.end
                    },

                    attendees: [
                    ],
                    description: (req.body.description ? req.body.description : null),
                    location: (req.body.location ? req.body.location : null),
                }
                if (req.body.attendees) {
                    for (let i = 0; i < req.body.attendees.length; i++) {
                        eventValue.attendees.push({
                            email: req.body.attendees[i].email
                        })
                    }
                }
                noticeService.addEvent(eventValue, (err, data) => {
                    if (err) {
                        console.log(err.message, 'eRRROR mESSAGE');
                        // console.log(err);
                        res.status(500).json('err');
                    } else {
                        req.body.eventId = data.id;
                        AdminModel.addEvent(req.body, (err, info) => {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                res.status(201).json(info);
                            }
                        })
                    }
                })
            } else {

            }
        }
    },
    getUsers(req, res) {
        UserService.isAdmin(req.session.user, callback)
        function callback(err, data) {
            if (err) {
                res.status(500).json({ message: err });
            } else if (data) {
                AdminModel.getUsers((err, data) => {
                    if (err) {
                        res.status(500).json({ message: err });
                    } else {
                        res.status(200).json(data);
                    }
                })
            }
        }
    },
    deleteUser(req, res) {
        AdminModel.deleteUser(req.params.id, (err, info) => {
            if (err) {
                res.status(500).json({ message: err })
            } else if (info) {
                res.status(200).send();
            } else {
                res.status(400).json({ message: 'Invalid User to Delete' });
            }
        })
    },
    updateUser(req, res) {
        UserService.isAdmin(req.session.user, callback);
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err });
            } else if (isAdmin) {
                AdminModel.updateUser(req.body, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: err })
                    } else {
                        res.status(200).end();
                    }
                })
            }
        }
    },
    deleteNotice(req, res) {
        UserService.isAdmin(req.session.user, callback)
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err })
            } else if (isAdmin) {
                AdminModel.isEvent(req.params.id, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: err });
                        res.end();
                    } else if (data.type == 'event') {
                        noticeService.deleteEvent(data.eventid, (err, data) => {
                            if (err) {
                                res.status(500).json({ message: err })
                            } else {
                                AdminModel.deleteNotice(req.params.id, (err, data) => {
                                    if (err) {
                                        res.status(500).json({ message: err })
                                    } else if (data) {
                                        res.status(200).end();
                                    } else {
                                        res.status(400).json({ message: 'Requested Notice not available' });
                                    }
                                })
                            }
                        })

                        //=================================================delete event and then delete notice
                    } else if (data.type == 'notice') {
                        AdminModel.deleteNotice(req.params.id, (err, data) => {
                            if (err) {
                                res.status(500).json({ message: err })
                            } else if (data) {
                                res.status(200).end();
                            } else {
                                res.status(400).json({ message: 'Requested Notice not available' });
                            }
                        })
                    } else {

                    }
                })
                // AdminModel.deleteNotice(req.params.id, (err, data) => {
                //     if (err) {
                //         res.status(500).json({ message: err })
                //     } else if (data) {
                //         res.status(200).end();
                //     } else {
                //         res.status(400).json({ message: 'Requested Notice not available' });
                //     }
                // })
            }
        }
    },
    editNotice(req, res) {
        UserService.isAdmin(req.session.user, callback);
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err });
            } else if (isAdmin) {
                if (req.body.type === 'event') {
                    updateEvent(req.params.id, req.body, (err, data) => {
                        if (err) {
                            res.status(500).json({ 'error': 'Updating Event Failed' })
                            res.end();
                        } else {
                            AdminModel.editEvent(req.params.id, req.body, (err, data) => {
                                if (err) {
                                    res.status(500).json({ message: err });
                                } else if (data) {
                                    res.status(200).end();
                                } else {
                                    res.status(400).json({ message: 'invalid notice to edit' });
                                    res.end();
                                }
                            })
                        }
                    })

                } else {
                    AdminModel.editNotice(req.params.id, req.body, (err, data) => {
                        if (err) {
                            res.status(500).json({ message: err });
                        } else if (data) {
                            res.status(200).end();
                        } else {
                            res.status(400).json({ message: 'invalid notice to edit' });
                        }
                    })
                }
                // AdminModel.editNotice(req.params.id, req.body, (err, data) => {
                //     if (err) {
                //         res.status(500).json({ message: err });
                //     } else if (data) {


                //         res.status(200).end();
                //         if (req.body.type === 'event') {
                //             updateEvent(req.body);
                //         }
                //     } else {
                //         res.status(400).json({ message: 'invalid notice to edit' });
                //     }
                // })
            }
        }
    },

    approveNotice(req, res) {
        let mailBody = "Your Requested notice is being approved by the Admin";
        let mailSubject = "Approved your request";
        let mailId = req.body.email;
        UserService.isAdmin(req.session.user, callback);
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err });
            } else if (isAdmin) {
                let approvedBy = req.session.user;
                AdminModel.approveNotice(req.body.id, req.body.approvedDate, approvedBy, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: err });
                    } else if (data) {
                        MailSerive.sendMail(mailId, mailBody, mailSubject, (err, data) => {
                        });
                        res.status(200).end();
                    } else {
                        res.status(400).json({ message: 'Invalid input to approve' });
                    }
                })

            } else {
                res.status(401).json({ message: 'Not an Admin' });
            }
        }
    },
    getArchivedNotices(req, res) {
        UserService.isAdmin(req.session.user, (err, admin) => {
            if (err) {
                res.status(500).json({ message: err });
                res.end();
            } else if (admin) {
                AdminModel.getArchivedNotices(req.params.page, (err, data) => {
                    if (err) {
                        res.status(500).json(err);
                        res.end();
                    } else {
                        UserService.joinCreatedByEmail(data.rows, (error, notices) => {
                            if (error) {
                                res.status(500).json({ message: err });
                                res.end();
                            } else {
                                if (data.count) {
                                    notices.push({
                                        count: data.count
                                    })
                                }
                                res.status(200).json(notices);
                                res.end();
                            }
                        })
                    }
                })
            } else {
                res.status(401).json({ message: 'the user is not an admin' });
                res.end();
            }
        })

    },
    archiveNotice(req, res) {
        AdminModel.archiveNotice(req.params.id, (err, data) => {
            if (err) {
                res.status(500).json(err);
                res.end();
            } else if (data) {
                res.status(200);
                res.end();
            } else {
                res.status(500).json({ message: 'The specified id for notice does not exists' });
                res.end();
            }
        })
    },

    // approveNotice(req, res) {
    //     UserService.isAdmin(req.session.user, callback);
    //     function callback(err, isAdmin) {
    //         if (err) {
    //             res.status(500).json({ message: err });
    //         } else if (isAdmin) {
    //             let approvedBy = req.session.user;
    //             let approvedDate = new Date()
    //             AdminModel.approveNotice(req.params.id, req.params.email, approvedBy, approvedDate, (err, data) => {
    //                 if (err) {
    //                     res.status(500).json({ message: err });
    //                 } else if (data) {
    //                     let mailBody="Your Requested notice is being approved by the user";
    //                     let mailSubject="Approved your request";
    //                     let mailId = req.session.user;
    //                     MailSerive.sendMail(mailId,mailBody,mailBody,(err,data)=>{
    //                     });
    //                     res.status(200).end();
    //                 } else {
    //                     res.status(400).json({ message: 'Invalid input to approve' });
    //                 }
    //             })

    //         } else {
    //             res.status(401).json({ message: 'Not an Admin' });
    //         }
    //     }
    // },
    rejectNotice(req, res) {
        UserService.isAdmin(req.session.user, callback);
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err });
            } else if (isAdmin) {
                AdminModel.rejectNotice(req.params.id, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: err });
                    } else if (data) {
                        res.status(200).end();
                    } else {
                        res.status(400).json({ message: 'Invalid Input ' });
                    }
                })
            }
        }
    }

}
// function updateEvent(id, event, callback) {
//     NoticeModel.getSingleNotice(id, (err, data) => {
//         if (err) {
//             callback(err);
//         } else {
//             let change = false;
//             if (new Date(data.start).toString() != new Date(event.start).toString()) {
//                 change = true;
//             }
//             if (new Date(data.end).toString() != new Date(event.end).toString()) {
//                 change = true;
//             }
//             if (data.title != event.title) {
//                 change = true;

//             }
//             if (data.attendees && event.attendees) {
//                 if (data.attendees[0].length == event.attendees.length) {
//                     for (let i = 0; i < data.attendees[0].length; i++) {
//                         if (data.attendees[0][i] == event.attendees[i]) {
//                         } else {
//                             change = false;
//                         }
//                     }
//                 } else {
//                     change = true;
//                 }
//             } else {
//                 change = true;
//             }
//             if (change == true) {
//                 let eventValue = {
//                     summary: event.title,
//                     start: {
//                         dateTime: event.start
//                     },
//                     end: {
//                         dateTime: event.end
//                     },

//                     attendees: [
//                     ]
//                 }
//                 if (event.attendees) {
//                     for (let i = 0; i < event.attendees.length; i++) {
//                         eventValue.attendees.push({
//                             email: event.attendees[i]
//                         })
//                     }
//                 }
//                 noticeService.updateEvent(eventValue, event.eventid, (err, data) => {
//                     if (err) {
//                         callback(err);
//                     } else {
//                         callback(null, data);
//                     }
//                 })
//             } else {
//                 callback(null, event);
//             }
//         }
//     })

// }







function updateEvent(id, event, callback) {
    console.log('update google event')
    NoticeModel.getSingleNotice(id, (err, data) => {
        if (err) {
            callback(err);
        } else {
            console.log(data.attendees)
            console.log(event.attendees)
            console.log('got single notice');
            let change = false;
            if (moment(data.start).toString() != moment(event.start).toString()) {
                console.log('start date')
                change = true;
            }
            if (moment(data.end).toString() != moment(event.end).toString()) {
                console.log('end date');
                change = true;
            }
            if (data.title != event.title) {
                console.log('title')
                change = true;

            }
            if (data.description != event.description) {
                console.log(data.description, '************', event.description)
                console.log('description')
                change = true;
            }
            console.log(change)
            if (data.attendees && event.attendees) {
                if (data.attendees[0].length == event.attendees.length) {
                    for (let i = 0; i < data.attendees[0].length; i++) {
                        if (data.attendees[0][i] == event.attendees[i].email) {
                        } else {
                            change = false;
                        }
                    }
                } else {
                    change = true;
                }
            } else {
                change = true;
            }
            console.log(change)
            if (change == true) {
                let eventValue = {
                    summary: event.title,
                    start: {
                        dateTime: moment(event.start)
                    },
                    end: {
                        dateTime: moment(event.end)
                    },

                    attendees: [
                    ],
                    description: event.description
                }
                if (event.attendees) {
                    for (let i = 0; i < event.attendees.length; i++) {
                        console.log(event.attendees[i].email);
                        eventValue.attendees.push({
                            email: event.attendees[i].email
                        })
                    }
                }
                console.log(event);
                noticeService.updateEvent(eventValue, event.eventid, (err, data) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                    }
                })
            } else {
                callback(null, event);
            }
        }
    })

}


