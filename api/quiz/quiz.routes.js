const express = require('express');
const { requireAuth }  = require('../../middlewares/requireAuth.middleware');
const { query, add, getById, update, remove } = require('./quiz.controller');

const router = express.Router();

router.get('/', query);
router.get('/:id', getById);
router.post('/', add, requireAuth);
router.put('/:id', update, requireAuth);
router.delete('/:id', remove, requireAuth);

module.exports = router;