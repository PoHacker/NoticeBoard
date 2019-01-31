var routes = require('./router');
var session = require('express-session');
var cookieParser = require('cookie-parser');

const express = require('express');
const bodyParser = require('body-parser');
const PORT = 5002;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    key: 'user_id',
    secret: 'sseecr',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000
    }
}));

app.use((req, res, next) => {
    console.log('here', req.method, req.path);
    if (!req.session.user && res.cookie.user_id) {
        res.clearCookie('user_id');
    }
    next();
})


app.use((req, res, next) => {

    // res.setHeader('Access-Control-Allow-Origin', 'https://argusoft-notice-board.firebaseapp.com');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.setHeader('Access-Control-Allow-Origin', 'http://192.1.200.113:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept,set-cookie');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

routes(app);

app.listen(PORT, (err) => {
    if (err) {
        throw err;
    } console.log('Node EndPoints Working :)');
});