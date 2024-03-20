const express = require('express');

const { auth } = require('../middleware/auth');

const router = express.Router();

const loginController = require('../controller/register');

router.get('/', loginController.getUsers);

router.post('/verify-email', loginController.sendMailToUser);

router.post('/verify-email/:token', loginController.verifyEmailWithToken);

router.post('/', loginController.createUser);

router.put("/:userId", auth, loginController.updateUser);

router.delete('/userId', loginController.deleteUser);

module.exports = router;