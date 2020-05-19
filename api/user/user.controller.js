const userService = require('./user.service');

module.exports = {
    update
}

async function update(req, res) {
    const user = req.body;
    const updatedUser = await userService.update(req.params.id, user);
    res.json(updatedUser);
}