const {
    Pool,
    Client
} = require('pg');
const squel = require('squel');

const notice_client = new Client(require('../config/config.json')["db"])
const user_client = new Client(require('../config/config.json')['user_db']);
user_client.connect();

module.exports = {
    isAdmin(userId, callback) {
        let text = squel.select().from('system_user_detail').field('type').where('user_id = ?', userId).toString();
        user_client.query(text, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, data.rows[0]['type']);
            }
        })
    },
    isUserExists(email, callback) {
        let text = squel
            .select()
            .from('system_user_detail')
            .field('email_address')
            .field('type')
            .field('user_id')
            .field('first_name')
            .field('last_name')
            .field('profile_pic')
            .where('email_address = ?', email)
            .toString();
        user_client.query(text, (err, data) => {
            if (err) {
                callback(err.message)
            } else if (data.rowCount > 0) {
                callback(null, data.rows[0])
            } else {
                callback(null, null);
            }
        })
    },
    getAllUsers(callback) {
        let text = squel
            .select()
            .from('system_user_detail')
            .field('first_name')
            .field('last_name')
            .field('user_id')
            .field('profile_pic')
            .field('email_address')
            .toString();
        user_client.query({ text: text, rowModel: 'array' }, (err, users) => {
            if (err) {
                callback(err.message)
            } else {
                callback(null, users.rows)
            }
        })
    }, getSingleUser(userId, callback) {
        let text = squel
            .select()
            .from('system_user_detail')
            .field('first_name')
            .field('last_name')
            .field('user_id')
            .field('email_address')
            .field('profile_pic')
            .where(`user_id = ${userId}`)
            .toString();
        user_client.query(text, (err, user) => {
            if (err) {
                callback(err.message)
            } else if (user.rowCount > 0) {
                callback(null, user.rows[0])
            } else {
                callback('Invalid User Selection');
            }
        })
    },
    getUserListWithEmail(callback) {
        let text = squel
            .select()
            .from('system_user_detail')
            .field('email_address')
            .field("concat(first_name,' ', last_name)", 'name')
            .toString();
        console.log(text,'query');
        user_client.query(text, (err, emails) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, emails.rows);
            }
        })
    }

}