const { google } = require('googleapis');
const fs = require('fs');

const TOKEN_PATH = './config/token.json';
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const moment = require('moment');

module.exports = {
    addEvent(event, callback) {
        fs.readFile('./config/credentials.json', (err, content) => {
            if (err) {
                callback('error in reading Credentials.json');
            }
            authorize(JSON.parse(content), insertEvent);
        });

        function authorize(credentials, insertEvent) {
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    callback('error in reading Token.json');
                }
                oAuth2Client.setCredentials(JSON.parse(token));
                insertEvent(oAuth2Client);
            });
        }
        function insertEvent(auth) {
            event['start']['dateTime'] = moment(event['start']['dateTime']);
            event['end']['dateTime'] = moment(event['end']['dateTime']);

            const calendar = google.calendar({ version: 'v3', auth });

            calendar.events.insert(
                {
                    auth: auth,
                    calendarId: 'primary',
                    resource: event,
                }, function (err, event) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, event.data)
                    }
                });


        }
    },
    updateEvent(data, eventid, callback) {
        console.log(eventid, 'IIIIIIIII**********************************************')
        fs.readFile('./config/credentials.json', (err, content) => {
            if (err) {
                callback('error in reading Credentials.json');
            }
            authorize(JSON.parse(content), updateEvent);
        });

        function authorize(credentials, updateEvent) {
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    callback('error in reading Token.json');
                }
                oAuth2Client.setCredentials(JSON.parse(token));
                updateEvent(oAuth2Client);
            });
        }
        function updateEvent(auth) {
            console.log('updating google event>>>>>>>>>>>>>>>>>>/////////////////....................')
            const calendar = google.calendar({ version: 'v3', auth });

            calendar.events.update({
                auth: auth,
                calendarId: 'primary',
                eventId: eventid,
                resource: data
            }, (err, response) => {
                console.log(response.data)
                console.log(err)
                if (err) {
                    callback('error in createing google event');
                } else {
                    callback(null, response.data);
                }
            })

        }

    },
    deleteEvent(eventid, callback) {
        fs.readFile('./config/credentials.json', (err, content) => {
            if (err) {
                callback('error in reading Credentials.json');
            }
            authorize(JSON.parse(content), deleteEvent);
        });

        function authorize(credentials, deleteEvent) {
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    callback('error in reading Token.json');
                }
                oAuth2Client.setCredentials(JSON.parse(token));
                deleteEvent(oAuth2Client);
            });
        }
        function deleteEvent(auth) {
            const calendar = google.calendar({ version: 'v3', auth });
            calendar.events.delete(
                {
                    auth: auth,
                    calendarId: 'primary',
                    eventId: eventid
                }, (err, data) => {
                    if (err) {
                        callback('err')
                    } else {
                        callback(null, 'success');
                    }
                }
            )
        }
    }
}