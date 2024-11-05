const express = require('express');
const router = express.Router();
const { checkAdminAuth } = require('../Middleware/CheckAdmin');
const { CreateLanguage, FetchLanguages, UpdateLanguage, DeleteLanguage } = require('../controllers/Language');
const { CreateModule, FetchModules, UpdateModule, DeleteModule } = require('../controllers/Module');
const { CreateType, FetchTypes, UpdateType, DeleteType } = require('../controllers/Type');
const { CreateDifficulty, FetchDifficulties, UpdateDifficulty, DeleteDifficulty } = require('../controllers/Difficult');
const { FetchUsers, DeleteUser } = require('../controllers/User');
const { CreateCodeSnippet, FetchCodeSnippets, UpdateCodeSnippet, DeleteCodeSnippet } = require('../controllers/CodeSnippet');
const { FetchAllTypingStats, FetchTypingStats, DeleteTypingStat } = require('../controllers/TypingStat');

// Language routes
router.post('/create/language', checkAdminAuth, CreateLanguage);
router.get('/fetch/languages', checkAdminAuth, FetchLanguages);
router.put('/update/language/:id', checkAdminAuth, UpdateLanguage);
router.delete('/delete/language/:id', checkAdminAuth, DeleteLanguage);

// Module routes
router.post('/create/module', checkAdminAuth, CreateModule);
router.get('/fetch/modules', checkAdminAuth, FetchModules);
router.put('/update/module/:id', checkAdminAuth, UpdateModule);
router.delete('/delete/module/:id', checkAdminAuth, DeleteModule);

// Type routes
router.post('/create/type', checkAdminAuth, CreateType);
router.get('/fetch/types', checkAdminAuth, FetchTypes);
router.put('/update/type/:id', checkAdminAuth, UpdateType);
router.delete('/delete/type/:id', checkAdminAuth, DeleteType);

// Difficulty routes
router.post('/create/difficulty', checkAdminAuth, CreateDifficulty);
router.get('/fetch/difficulties', checkAdminAuth, FetchDifficulties);
router.put('/update/difficulty/:id', checkAdminAuth, UpdateDifficulty);
router.delete('/delete/difficulty/:id', checkAdminAuth, DeleteDifficulty);

// User routes
router.get('/fetch/users', checkAdminAuth, FetchUsers);
router.delete('/delete/user/:id', checkAdminAuth, DeleteUser);

// Code snippet routes
router.post('/create/snippet', checkAdminAuth, CreateCodeSnippet);
router.get('/fetch/snippets', checkAdminAuth, FetchCodeSnippets);
router.put('/update/snippet/:id', checkAdminAuth, UpdateCodeSnippet);
router.delete('/delete/snippet/:id', checkAdminAuth, DeleteCodeSnippet);

// Typing Stat routes
router.get('/fetch/typingstats', checkAdminAuth, FetchTypingStats);
router.get('/fetch/alltypingstats', checkAdminAuth, FetchAllTypingStats);
router.delete('/delete/typingstat/:id', checkAdminAuth, DeleteTypingStat);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};

// Use error handling middleware
router.use(errorHandler);

module.exports = router;
