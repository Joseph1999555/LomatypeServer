const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middleware/VerifyToken');
const { FetchUserById } = require('../controllers/User');
const { FetchLanguages } = require('../controllers/Language');
const { FetchModules } = require('../controllers/Module');
const { FetchTypes } = require('../controllers/Type');
const { CreateDifficulty, FetchDifficulties, UpdateDifficulty, DeleteDifficulty } = require('../controllers/Difficult');
const { FetchUsers } = require('../controllers/User');
const { FetchCodeSnippets, FetchCodeSnippet2, RandomCodeSnippet } = require('../controllers/CodeSnippet');
const { FetchAllTypingStats, fetchLeaderboard, CreateTypingStat, FetchTypingStats } = require('../controllers/TypingStat');

// User routes
router.get('/fetch/user/:id', FetchUserById);

// Language routes
router.get('/fetch/languages', FetchLanguages);

// Module routes
router.get('/fetch/modules', FetchModules);

// Type routes
router.get('/fetch/types', FetchTypes);

// Difficulty routes
router.post('/create/difficulty', CreateDifficulty);
router.get('/fetch/difficulties', FetchDifficulties);
router.put('/update/difficulty/:id', UpdateDifficulty);

// User routes
router.get('/fetch/users', FetchUsers);

// Code snippet routes
router.get('/fetch/snippets', FetchCodeSnippets);
router.get('/fetch/snippet2', FetchCodeSnippet2);
router.get('/fetch/randomsnippet', RandomCodeSnippet);

// Typing Stat routes
router.post('/create/typingstat', CreateTypingStat);
router.get('/fetch/typingstats', verifyToken, FetchTypingStats);
router.get('/fetch/alltypingstats', FetchAllTypingStats);
router.get('/fetch/leaderboard', fetchLeaderboard);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};

// Use error handling middleware
router.use(errorHandler);

module.exports = router;