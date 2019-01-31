const {
    Pool,
    Client
} = require('pg');
const pg = require('pg');
const squel = require('squel');
const MailService = require('../services/mailService');
const moment = require('moment');

const notice_client = new Client(require('../config/config.json')["db"])

notice_client.connect();

module.exports = {
    searchPendingNotices(string, callback) {
        let text = `SELECT * FROM argusnotice  WHERE title LIKE '%${string}%' OR description LIKE '%${string}%' AND status='Pending';`
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                data.rows = unescapeTitleDescription(data.rows)
                callback(null, data.rows);
            }
        });

    },
    searchArchivedNotices(string, callback) {
        let text = `SELECT * FROM argusnotice  WHERE title LIKE '%${string}%' OR description LIKE '%${string}%' AND status='Archived';`
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                data.rows = unescapeTitleDescription(data.rows);
                callback(null, data.rows);
            }
        });

    },
    searchApprovedNotices(string, callback) {
        let text = `SELECT * FROM argusnotice  WHERE title LIKE '%${string}%' OR description LIKE '%${string}%' AND status='Approved';`
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                data.rows = unescapeTitleDescription(data.rows);
                callback(null, data.rows);
            }
        });
    },
    searchEvents(string, callback) {
        let text = `SELECT * FROM argusnotice  WHERE title LIKE '%${string}%' OR description LIKE '%${string}%' AND type='event';`
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                data.rows = unescapeTitleDescription(data.rows);
                callback(null, data.rows);
            }
        });
    },
    isEvent(noticeId, callback) {
        const text = squel
            .select()
            .field('type')
            .field('eventid')
            .from('argusnotice')
            .where('id = ?', noticeId)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, data.rows[0])
            } else {
                callback(null, null);
            }
        })
    },

    deleteNotice(noticeId, callback) {
        const text = squel
            .delete()
            .from('argusnotice')
            .where('id = ?', noticeId)
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, data)
            } else {
                callback(null, null)
            }
        })
    },
    editEvent(id, event, callback) {
        let attendesData = '';
        if (event.attendees) {
            event.attendees.forEach((item, index) => {
                attendesData = attendesData + item.email + ','
            });
            attendesData = attendesData.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        }

        // let text = `INSERT INTO argusnotice(title, description, createdby, creationdate, type, start, "end", eventid, attendees)
        // VALUES('${escape(event.title)}', '${escape(event.description)}', '${event.createdBy}', '${event.createdAt}',
        //  '${event.type}','${event.start}','${event.end}','${event.eventId}','{${attendesData}}')`;


        const text = `UPDATE argusnotice SET title = '${escape(event.title)}', description = '${escape(event.description)}', start = '${event.start}',
                        "end" = '${event.end}', attendees = '{${attendesData}}' WHERE (argusnotice.id = ${id})`;
        console.log(text);

        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, data);
            } else {
                callback(null, null);
            }
        })
    },
    editNotice(id, notice, callback) {

        const text = `UPDATE argusnotice SET title = '${escape(notice.title)}', description = '${escape(notice.description)}' WHERE (argusnotice.id = ${id})`

        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, data);
            } else {
                callback(null, null);
            }
        })
    },
    approveNotice(id, approvedDate, approvedBy, callback) {
        pg.types.setTypeParser(1114, approvedDate => approvedDate);
        const text = squel
            .update()
            .table('argusnotice')
            .set('status', 'Approved')
            .set('approvedby', approvedBy)
            .set('approveddate', approvedDate)
            .where('id = ?', id)
            .toString();

        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, data);
            } else {
                callback(null, null);
            }
        })
    },
    archiveNotice(noticeId, callback) {
        let text = squel
            .update()
            .table('argusnotice')
            .set('status', 'Archived')
            .where('id = ?', noticeId)
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
    getArchivedNotices(pageNo, callback) {
        let perpage = 11;
        let offset = (perpage * pageNo) - perpage;
        let text = squel
            .select()
            .field('id')
            .field('createdby')
            .field('creationdate')
            .field('title')
            .field('description')
            .field('id')
            .limit(perpage)
            .offset(offset)
            .order('creationdate', false)
            .from('argusnotice')
            .where('status = ?', 'Archived')
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callbcak(err.message);
            } else {
                if (pageNo == 1) {
                    let text = squel
                        .select()
                        .field('COUNT(*)')
                        .from('argusnotice')
                        .where(`status = 'Archived'`)
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
    rejectNotice(id, callback) {
        const text = squel
            .delete()
            .from('argusnotice')
            .where('id = ?', id)
            .where('status = ?', 'Pending')
            .toString();
        notice_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else if (data.rowCount > 0) {
                callback(null, data);
            } else {
                callback(null, null);
            }
        })
    },
    addEvent(event, callback) {
        let attendesData = '';
        if (event.attendees) {
            event.attendees.forEach((item, index) => {
                attendesData = attendesData + item.email + ','
            });
            attendesData = attendesData.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        }
        let text = `INSERT INTO argusnotice(title, description, createdby, creationdate, type, start, "end", eventid, attendees)
        VALUES('${escape(event.title)}', '${escape(event.description)}', '${event.createdBy}', '${event.createdAt}',
         '${event.type}','${event.start}','${event.end}','${event.eventId}','{${attendesData}}')`;

        notice_client.query(text, (err, info) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, info);
            }
        })

    },
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