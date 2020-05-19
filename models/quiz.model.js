const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: String,
    description: String,
    subjects: [ String ],
    at: Number,
    bestTime: Number,
    by: Object,
    questions: [ Object ]
});

const Quiz = mongoose.model('Quiz', quizSchema); 

module.exports = Quiz;