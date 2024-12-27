const User = require('../models/manufacturer');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const conFig = require('../configure');

exports.LoginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'No record found for this email on our platform' });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ message: 'Please verify your email address before logging in' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
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
            conFig.jwtKey,
            { expiresIn: '1h' }
        );
        console
        res.status(200).json({ message: "Authentication successful", token: token, isFirstLogin: isFirstLogin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




