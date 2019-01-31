const validator = require('./validator')
const UserController = require('./controllers/userController');
const NoticeController = require('./controllers/noticeController');
const AdminController = require('./controllers/adminController')
module.exports = routes;

var isLoggedIn = (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
        next();
    } else {
        res.status(401).json({ status: 'Login First' });
    }
}
var isNotLoggedIn = (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {

        res.status(401).json({ status: 'Logout First' });
        res.end();
    } else {
        next();
    }
}

function routes(app) {

    //====================================================================================DEPRECATED APIS
    // app.post('/otp-generation', validator.otpGeneration, UserController.generateOtp);
    // app.post('/create-user', validator.userRegistration, UserController.addUser);
    // app.post('/login', isNotLoggedIn, validator.login, UserController.login);
    // app.get('/users', isLoggedIn, AdminController.getUsers);
    // app.put('/update-user', isLoggedIn, validator.updateUser, AdminController.updateUser);
    // app.delete('/user/:id', isLoggedIn, validator.deleteUser, AdminController.deleteUser);
    // app.get('/user/:id', isLoggedIn, validator.deleteUser, UserController.getUser)
    //======================================================================================DEPRECATED APIS




    //====================================================================================APIS FOR ADMIN
    app.get('/get-notices/:page', isLoggedIn, NoticeController.getNotices);
    app.get('/get-events/:page', isLoggedIn, NoticeController.getEvents)
    app.delete('/notice/:id', isLoggedIn, validator.deleteValidator, AdminController.deleteNotice);
    // app.delete('/event/:id', isLoggedIn, validator.deleteNotice, AdminController);
    app.put('/approve-notice', isLoggedIn, validator.approveNotice, AdminController.approveNotice)
    app.get('/pending-notices/:page', isLoggedIn, NoticeController.getPendingNotices);
    app.post('/add-event', isLoggedIn, validator.addEvent, AdminController.addEvent)
    app.get('/reject-notice/:id', isLoggedIn, validator.singleIdValidator, AdminController.rejectNotice)
    app.put('/notice/:id', isLoggedIn, validator.editNotice, AdminController.editNotice);
    app.get('/get-user-list', isLoggedIn, UserController.getUserListWithEmail);
    app.get('/archive-notice/:id', isLoggedIn, validator.deleteValidator, AdminController.archiveNotice)
    app.get('/archived-notices/:page', isLoggedIn, AdminController.getArchivedNotices);
    app.get('/search-pending-notices/:str', isLoggedIn, AdminController.searchPendtionNotices)
    app.get('/search-approved-notices/:str', isLoggedIn, AdminController.searchApprovedNotices)
    app.get('/search-archived-notices/:str', isLoggedIn, AdminController.searchArchivedNotices)
    app.get('/search-events/:str', isLoggedIn, AdminController.searchEvents)
    //=================================================================================APIS FOR ADMIN


    //===============================================================================APIS FOR NORMAL USER
    app.get('/logout', isLoggedIn, UserController.logout);
    app.post('/google-login', isNotLoggedIn, validator.googleLogin, UserController.googleLogin);
    app.post('/comment', isLoggedIn, validator.addComment, NoticeController.addComment);
    app.post('/add-notice', isLoggedIn, validator.addNotice, NoticeController.addNotice);
    app.delete('/comment/:id', isLoggedIn, validator.deleteValidator, NoticeController.deleteComment);
    app.put('/comment/:id', isLoggedIn, validator.editComment, NoticeController.editComment)


    app.get('/single-notice/:id', validator.singleIdValidator, NoticeController.getSingleNotice)
    app.get('/get-dashboard-notices/:page', NoticeController.getDashboardNotice);
    app.get('/get-comments/:id', validator.singleIdValidator, NoticeController.getComments);
    app.get('/get-dashboard-events/:page', NoticeController.getDashboardEvents);

    //========================================================================================APIS FOR NORMAL USER
}