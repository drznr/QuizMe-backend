const Quiz = require('../../models/quiz.model');
const ObjectId = require('mongodb').ObjectId;
const logger = require('../../services/logger.service');

module.exports = {
    query,
    add,
    getById,
    update,
    remove
}

async function query(filterBy = {}) {
    const isSorted = filterBy.sortBy;
    const criteria = _buildCriteria(filterBy); 
    try {
        const quizzes = await Quiz.find(criteria.query).sort(criteria.sortBy).limit(criteria.limit);
        return (isSorted) ? quizzes : _shuffle(quizzes);
    } catch (err) {
        logger.error('[QUERY]: Cannot find quizzes ', err);
        throw err;
    }
}

async function getById(id) {
    try {
       return await Quiz.findById(ObjectId(id)); 
    } catch (err) {
        logger.error('[GET_BY_ID]: Cannot find quiz ', err);
        throw err;
    }
}

async function update(id, quiz) { 
    try {
        return await Quiz.findByIdAndUpdate(ObjectId(id), quiz, { new: true }); 
    } catch (err) {
        logger.error('[UPDATE]: Cannot update quiz ', err);
        throw err;
    }
}

async function add(quiz, userId) {
    try {
        quiz = { ...quiz, at: Date.now(), bestTime: Number.MAX_SAFE_INTEGER, by: ObjectId(userId) };
        const newQuiz = await new Quiz(quiz).save();  
        return newQuiz;
    } catch (err) {
        logger.error('[ADD]: Cannot insert quiz', err);
        throw err;
    }
}

async function remove(id) {
    try {
       await Quiz.findByIdAndRemove(ObjectId(id));
    } catch (err) {
        logger.error('[REMOVE]: Cannot remove quiz', err);
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {
        query: {},
        sortBy: {},
        limit: 25
    };
    
    if (filterBy.title) criteria.query.title = { $regex: filterBy.title, $options: 'i' };

    if (filterBy.subject) criteria.query.subjects = { $in: [filterBy.subject] };

    if (filterBy.by) criteria.query.by = ObjectId(filterBy.by);
   
    if (filterBy.sortBy === 'at') criteria.sortBy.at = (JSON.parse(filterBy.isDesc)) ? 1 : -1; 
    else if (filterBy.sortBy === 'title') criteria.sortBy.title = (JSON.parse(filterBy.isDesc)) ? -1 : 1;

    if (filterBy.title || filterBy.subject || filterBy.by) criteria.limit = Number.MAX_SAFE_INTEGER;
    
    return criteria;
}

function _shuffle(arr) {
    let counter = arr.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}