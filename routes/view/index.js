const router = require('express').Router();
const middlewares = require('../../middlewares');


router.get(['/', '/workspace'], require('./workspace'));
router.get(['/signup', '/signin'], middlewares.auth.isNotMember, require('./account'));
router.get(['/', '/favorite'], middlewares.auth.isMember, require('./favorite'));

module.exports = router;