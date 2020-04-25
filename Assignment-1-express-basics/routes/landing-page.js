const express = require('express');

const rootDir = require('../utility/path');

const router = express.Router();

const path = require('path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'landing-page.html'));
});

module.exports = router;