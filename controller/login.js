const User = require('../models/manufacturer');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


exports.LoginUser = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
        return res.status(400).json({ message: 'Please verify your email address before logging in' });
    }

    bcrypt.compare(req.body.password, user.password)
        .then(async validPassword => {
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            let isFirstLogin = false;

            if (user.isFirstTimeLogin) {
                isFirstLogin = true;
                user.isFirstTimeLogin = false;
                await user.save();
            }

            user.lastLoginAt = Date.now();
            await user.save();

            const token = jwt.sign(
                { userId: user._id, email: user.email, isFirstLogin: isFirstLogin },
                config.get('jwtPrivateKey'),
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: "Authentication successful", token: token, isFirstLogin: isFirstLogin });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
};



