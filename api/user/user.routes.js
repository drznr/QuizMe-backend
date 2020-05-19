const express = require('express');
const { requireAuth }  = require('../../middlewares/requireAuth.middleware');
const { update } = require('./user.controller');

const router = express.Router();


router.put('/:id', update, requireAuth);

module.exports = router;