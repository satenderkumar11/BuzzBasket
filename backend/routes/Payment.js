const express = require('express');
const { verifyPayment, createPayment } = require('../controller/Payment');


const router = express.Router();

router.post('/', createPayment).post('/verify', verifyPayment);

exports.router = router;
