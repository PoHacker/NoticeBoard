const {
    Pool,
    Client
} = require('pg');
const squel = require('squel');

const notice_client = new Client(require('../config/config.json')["db"])
const user_client = new Client(require('../config/config.json')['user_db']);
notice_client.connect();

module.exports = {
    getDashboardEvents(pageNo, callback) {
        let perPage = 10;
        let offset = (perPage * pageNo - perPage);

        let text = squel.select()
            .from('argusnotice')
            .field('description')
            .field('title')
            .field('status')
            .field('id')
            .field('start')
            .field('creationdate')
            .field('createdby')
            .where(`type = 'event'`)
            .where(`DATE("end") > DATE(NOW())`)
            .offset(offset)
            .order('start', false)
            .toString();
        console.log(text);
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {

                data.rows = unescapeTitleDescription(data.rows);
                callback(null, data.rows);
            }
        })
    },
    getDashboardNotice(pageNo, callback) {
        let perPage = 6;
        let offset = (perPage * pageNo - perPage);

        let text = squel
            .select()
            .from('argusnotice')
            .field('title')
            // .field('COUNT(*)')
            .field('description')
            .field('createdby')
            .field('creationdate')
            .field('id')
            .where(`status = 'Approved'`)
            .offset(offset)
            .limit(perPage)
            .order('creationdate', false)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                if (pageNo == 1) {
                    let text = squel
                        .select()
                        .field('COUNT(*)')
                        .from('argusnotice')
                        .where(`status = 'Approved'`)
                        .toString();
                    notice_client.query(text, (reason, count) => {
                        if (!reason) {
                            data.count = parseInt(count.rows[0].count);
                            data.rows = unescapeTitleDescription(data.rows);
                            callback(null, data);
                        } else {
                            callback(reason.message);
                        }
                    })
                } else {
                    data.rows = unescapeTitleDescription(data.rows);
                    callback(null, data);
                }
                // data.rows = unescapeTitleDescription(data.rows);
                // callback(null, data);
            }
        })
    },
    getEvents(pageNo, callback) {
        let perPage = 11;
        let offset = (perPage * pageNo - perPage);

        let text = squel.select()
            .from('argusnotice')
            .field('description')
            .field('title')
            .field('id')
            .field('creationdate')
            .field('createdby')
            .field('start')
            .field(`"end"`)
            .offset(offset)
            .limit(perPage)
            .order('creationdate', false)
            .where(`type = 'event'`)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {

                if (pageNo == 1) {
                    let text = squel
                        .select()
                        .field('COUNT(*)')
                        .from('argusnotice')
                        .where(`type = 'event'`)
                        .toString();
                    notice_client.query(text, (reason, count) => {
                        if (!reason) {
                            data.count = parseInt(count.rows[0].count);
                            data.rows = unescapeTitleDescription(data.rows);
                            callback(null, data);
                        } else {
                            callback(reason.message);
                        }
                    })
                } else {
                    data.rows = unescapeTitleDescription(data.rows);
                    callback(null, data);
                }



                // data.rows = unescapeTitleDescription(data.rows);
                // callback(null, data.rows);
            }
        })
    },
    getNotices(pageNo, callback) {
        let perPage = 11;
        let offset = (perPage * pageNo - perPage);

        let text = squel.select()
            .from('argusnotice')
            .field('approvedby')
            .field('approveddate')
            .field('description')
            .field('title')
            .field('id')
            .field('creationdate')
            .field('createdby')
            .where(`type = 'notice'`)
            .where(`status = 'Approved'`)
            .limit(perPage)
            .offset(offset)
            .order('creationdate', false)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                if (pageNo == 1) {
                    let text = squel
                        .select()
                        .field('COUNT(*)')
                        .from('argusnotice')
                        .where(`status = 'Approved'`)
                        .toString();
                    notice_client.query(text, (reason, count) => {
                        if (!reason) {
                            data.count = parseInt(count.rows[0].count);
                            data.rows = unescapeTitleDescription(data.rows);
                            callback(null, data);
                        } else {
                            callback(reason.message);
                        }
                    })
                } else {
                    data.rows = unescapeTitleDescription(data.rows);
                    callback(null, data);
                }
            }
        })
    },
    getSingleNotice(id, callback) {
        const text = squel.select()
            .from('argusnotice')
            .field('argusnotice.creationdate')
            .field('argusnotice.description')
            .field('argusnotice.title')
            .field('argusnotice.type')
            .field('argusnotice.start')
            .field('argusnotice.end')
            .field('argusnotice.eventid')
            .field('json_build_array(argusnotice.attendees)', 'attendees')
            .field('createdby')
            .where('argusnotice.id = ?', id)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                data.rows = unescapeTitleDescription(data.rows);
                callback(null, data.rows[0]);
            } else {
                callback(null, null);
            }
        })
    },
    addNotice(notice, callback) {
        let text = squel.insert()
            .into('argusnotice')
            .set('title', escape(notice.title))
            .set('description', escape(notice.description))
            .set('createdby', notice.createdBy)
            .set('creationdate', notice.createdAt)
            .set('status', notice.status)
            .set('type', notice.type)
            .toString();

        notice_client.query(text, (err, info) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, info);
            }
        })
    },
    // addEvent(event, callback) {
    //     let text = `INSERT INTO argusnotice(title, description, createdby, creationdate, type, start, "end", eventid, attendees)
    //     VALUES('${escape(event.title)}', '${escape(event.description)}', '${event.createdBy}', '${event.createdAt}',
    //      '${event.type}','${event.start}','${event.end}','${event.eventId}','{${event.attendees}}')`;

    //     let text1 = squel
    //         .insert()
    //         .into('argusnotice')
    //         .set('title', escape(event.title))
    //         .set('description', escape(event.description))
    //         .set('createdby', event.createdBy)
    //         .set('creationdate', event.createdAt)
    //         .set('type', event.type)
    //         .set('start', event.start)
    //         .set('end', event.end)
    //         .set('eventid', event.eventId)
    //         .set('attendees', event.attendees)
    //         .toString();
    //     console.log(text1);

    //     notice_client.query(text, (err, info) => {
    //         if (err) {
    //             callback(err.message);
    //         } else {
    //             callback(null, info);
    //         }
    //     })

    // },
    getPendingNotices(pageNo, callback) {
        let perPage = 10;
        let offset = (perPage * pageNo) - perPage;

        let text = squel
            .select()
            .field('argusnotice.title')
            .field('argusnotice.description')
            .field('argusnotice.createdby')
            .field('argusnotice.creationdate')
            .limit(perPage)
            .offset(offset)
            .from('argusnotice')
            .field('argusnotice.id')
            .where('status = ?', 'Pending')
            .order('argusnotice.creationdate', false)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                if (pageNo == 1) {
                    let text = squel
                        .select()
                        .field('COUNT(*)')
                        .from('argusnotice')
                        .where(`status = 'Pending'`)
                        .toString();
                    notice_client.query(text, (reason, count) => {
                        if (!reason) {
                            data.count = parseInt(count.rows[0].count);
                            data.rows = unescapeTitleDescription(data.rows);
                            callback(null, data);
                        } else {
                            callback(reason.message);
                        }
                    })
                } else {
                    data.rows = unescapeTitleDescription(data.rows);
                    callback(null, data);
                }
            }
        })
    },
    getComments(noticeId, callback) {
        let text = squel.select()
            .field('comment.creationdate')
            .field('comment.description')
            .field('createdby')
            .field('id')
            .from('comment')
            .where('noticeid = ?', noticeId)
            .order('creationdate')
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                data.row = unescapeDescription(data.rows)
                callback(null, data.rows);
            }
        })
    },
    addComment(body, callback) {
        let text = squel
            .insert()
            .into('comment')
            .set('description', escape(body.comment))
            .set('"createdby"', body.user)
            .set('"noticeid"', body.noticeId)
            .set('creationdate', body.creationDate)
            .toString();
        notice_client.query(text, (err, info) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, info);
            }
        })
    },
    deleteComment(commentId, callback) {
        let text = squel
            .delete()
            .from('comment')
            .where('id = ?', commentId)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, true);
            } else {
                callback(null, null);
            }
        })

    },
    editComment(commentId, comment, callback) {
        let text = squel
            .update()
            .table('comment')
            .set('description', comment)
            .where('id = ?', commentId)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, true);
            } else {
                callback(null, null);
            }
        })
    }
}

function unescapeDescription(arr) {
    return arr.map((value, index, array) => {
        value.description = unescape(value.description);
        // value.title = unescape(value.title);
        return value;
    })
}
function unescapeTitleDescription(arr) {
    return arr.map((value, index, array) => {
        value.description = unescape(value.description);
        value.title = unescape(value.title);
        return value;
    })
}
