const express = require('express');
const router = express.Router();

const frontendRouter = require('./FrontendRoutes');
const apiRouter = require('./APIRoutes');

router.use('/api', apiRouter);
router.use(frontendRouter);

module.exports = router;