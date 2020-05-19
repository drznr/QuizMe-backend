const quizService = require('./quiz.service');

module.exports = {
    query,
    add,
    getById,
    update,
    remove
}

async function query(req, res) {
    const criteria = req.query;
    const stations = await quizService.query(criteria);
    res.json(stations);
}

async function getById(req, res) {
    const quiz = await quizService.getById(req.params.id);
    res.json(quiz);
}

async function add(req, res) {
    const quiz = req.body;
    const userId = req.session.user._id;
    const savedQuiz = await quizService.add(quiz, userId);
    res.json(savedQuiz);
}

async function update(req, res) {
    const quiz = req.body;
    const updatedQuiz = await quizService.update(req.params.id, quiz);
    res.json(updatedQuiz);
}

async function remove(req, res) {
    await quizService.remove(req.params.id);
    res.end();
}