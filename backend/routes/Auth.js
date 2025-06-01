const express = require('express');
const { createUser, loginUser, getUserByToken, logoutUser } = require('../controller/Auth');


const router = express.Router();
//  /auth is already added in base path
router.post('/signup', createUser).post('/login', loginUser).get('/getUserByToken', getUserByToken).get('/logout', logoutUser);

exports.router = router;
