const NoticeModel = require('../models/noticeModels');
const UserService = require('../services/userService');
const noticeService = require('../services/noticeService');

module.exports = {
    getDashboardEvents(req, res) {
        NoticeModel.getDashboardEvents(req.params.page, (err, data) => {
            if (err) {
                res.status(500).json({ message: err });
            } else {
                UserService.joinCreatedByWithProfilePic(data, (err, events) => {
                    if (err) {
                        res.status(500).json({ message: err });
                        res.end();
                    } else {
                        res.status(200).json(events);
                        res.end();
                    }
                })
            }
        })
    },
    getDashboardNotice(req, res) {
        NoticeModel.getDashboardNotice(req.params.page, (err, data) => {
            if (err) {
                res.status(500).json({ message: err });
            } else if (data.rowCount > 0) {

                UserService.joinCreatedByWithProfilePic(data.rows, (error, notices) => {
                    if (error) {
                        res.status(500).json({ message: error });
                        res.end();
                    } else {
                        if (data.count) {
                            console.log(data.count, 'count added...........................');
                            notices.push({
                                count: data.count
                            })
                        }
                        console.log(notices, 'notices.count....................')
                        res.status(200).json(notices);
                        res.end();
                    }
                })
            } else {
                console.log('nodata');
            }
        })
    },

    getNotices(req, res) {
        UserService.isAdmin(req.session.user, callback)
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err });
                res.end();
            } else if (isAdmin) {

                NoticeModel.getNotices(req.params.page, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: err });
                    } else {
                        UserService.joinCreatedApprovedBy(data.rows, (err, notices) => {
                            if (err) {
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
                res.status(401).json({ message: "You Are Not an Admin" });
                res.end();
            }
        }

    },
    getEvents(req, res) {
        UserService.isAdmin(req.session.user, callback)
        function callback(err, isAdmin) {
            if (err) {
                res.status(500).json({ message: err });
                res.end();
            } else if (isAdmin) {
                NoticeModel.getEvents(req.params.page, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: err });
                    } else {
                        UserService.joinCreatedBy(data.rows, (err, events) => {
                            if (err) {
                                res.status(500).json({ message: err });
                            } else {
                                if (data.count) {
                                    events.push({
                                        count: data.count
                                    })
                                }
                                res.status(200).json(events);
                                res.end();
                            }
                        })
                    }
                })
            } else {
                res.status(401).json({ message: "You Are Not an Admin" });
                res.end();
            }
        }

    },
    getSingleNotice(req, res) {
        NoticeModel.getSingleNotice(req.params.id, (err, data) => {
            console.log(err)
            if (err) {
                res.status(500).json({ message: err })
            } else if (data) {
                console.log(data.attendees)
                UserService.joinSingleCreatedByProfilePic(data, (err, singleNotice) => {
                    if (err) {
                        res.status(500).json({ message: err })
                        res.end();
                    } else {
                        res.status(200).json(singleNotice);
                        res.end();
                    }
                })
            } else {
                res.status(400).json({ message: 'Notice does not Exist' });
            }
        })
    },
    addNotice(req, res) {
        req.body.createdBy = req.session.user;
        UserService.isAdmin(req.session.user, (err, isAdmin) => {
            if (err) {
                res.status(500).json({ message: err });
                res.end();
            } else if (isAdmin) {
                req.body.status = 'Approved';
            } else {
                req.body.status = "Pending";
            }
            NoticeModel.addNotice(req.body, (err, data) => {
                if (err) {
                    res.status(500).json({ message: err });
                } else {
                    res.status(201);
                    res.end();
                }
            })
        });
    },
    getPendingNotices(req, res) {
        UserService.isAdmin(req.session.user, (err, isAdmin) => {
            if (err) {
                res.status(500).json({ message: err });
                res.end();
            } else if (isAdmin) {
                NoticeModel.getPendingNotices(req.params.page, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: err });
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
                res.status(401).json({ message: "You Are Not an Admin" });
            }
        })
    },
    getComments(req, res) {
        let noticeId = req.params.id;
        NoticeModel.getComments(noticeId, (err, data) => {
            if (err) {
                res.status(500).json({ message: err });
                res.end()
            } else {
                UserService.joinCreatedByWithProfilePic(data, (error, comments) => {
                    if (error) {
                        res.status(500).json({ message: error });
                        res.end();
                    } else {
                        res.status(200).json(comments);
                        res.end();
                    }
                })
            }
        })
    },
    addComment(req, res) {
        req.body.user = req.session.user;
        NoticeModel.addComment(req.body, (err, info) => {
            if (err) {
                res.status(500).json({ message: err });
            } else {
                res.status(201).end();
            }
        })
    },
    deleteComment(req, res) {
        NoticeModel.deleteComment(req.params.id, (err, data) => {
            if (err) {
                res.status(500).json(err);
                res.end();
            } else if (data) {
                res.status(200)
                res.end();
            } else {
                res.status(500).json({ 'message': 'Comment not fount' });
                res.end();
            }
        })
    },
    editComment(req, res) {
        NoticeModel.editComment(req.params.id, req.body.comment, (err, data) => {
            if (err) {
                res.status(500).json({ message: err })
                res.end();
            } else if (data) {
                res.status(200);
                res.end();
            } else {
                res.status(500);
                res.end();
            }
        })
    }


    // addEvent(event) {
    //     let eventValue = {
    //         summary: event.summary,
    //         start: {
    //             dateTime: event.start
    //         },
    //         end: {
    //             dateTime: event.end
    //         },

    //         attendees: [
    //         ]
    //     }
    //     for (let i = 0; i < event.attendees.length; i++) {
    //         eventValue.attendees.push({
    //             email: event.attendees[i]
    //         })
    //     }


    //     // this._calendarService.createEvent(eventValue).subscribe((info) => {
    //     //     this._router.navigate(['/show-events']);
    //     // }, (err) => {
    //     // })
    // }

}
function addEvent(event, callback) {
    let eventValue = {
        summary: event.title,
        description: event.description,
        start: {
            dateTime: event.start
        },
        end: {
            dateTime: event.end
        },

        attendees: [
        ]
    }
    if (event.attendees) {
        for (let i = 0; i < event.attendees.length; i++) {
            eventValue.attendees.push({
                email: event.attendees[i].email
            })
        }
    }
    noticeService.addEvent(eventValue, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })

}