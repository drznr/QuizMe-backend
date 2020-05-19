const User = require('../../models/user.model');
const ObjectId = require('mongodb').ObjectId;
const logger = require('../../services/logger.service');

module.exports = {
    getByEmail,
    update,
    add
}

async function getByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (err) {
        logger.error(`[getByEmail]: While finding user ${email} `, err);
        throw err;
    }
}

async function update(id, user) {
    try {
        const { username, email, avatar } = user;
        return await User.findByIdAndUpdate(ObjectId(id), { username, email, avatar }, { new: true });
    } catch (err) {
        logger.error(`[UPDATE]: Cannot update user `, err);
        throw err;
    }
}

async function add(user) {
    try {
        user.at = Date.now();
        const newUser = await new User(user).save();
        return newUser;
    } catch (err) {
        logger.error(`[ADD]: Cannot insert user `, err);
        throw err;
    }
}