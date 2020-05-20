const express = require('express');
const routes = express.Router();

const UserController = require('../controllers/UserController');

routes.post('/user/logon', UserController.logon);
routes.post('/user/login', UserController.login);

routes.post('/user/friends', UserController.onlineFriend);
routes.post('/user/make-friend', UserController.makeFriend);

routes.post('/user/search', UserController.search);

module.exports = routes;