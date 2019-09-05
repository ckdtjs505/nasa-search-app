const router = require('express').Router();
const modAccount = require('../../../models/account');
const util = require('./util');
const Error = require('../util/error');

const findById = async id => {
	const accountInfo = await modAccount.findOne({ id });
	return accountInfo;
};

const isExistsById = async id => {
	const accountInfo = await findById(id);
	return !!accountInfo;
};

const isExistsAccountInfo = async (id, pw) => {
	if (!id || !pw) {
		throw new Error.InvalidRequest();
	}

	const accountInfo = await findById(id);
	if (!accountInfo) {
		throw new Error.IncorrectAccount();
	}

	const isEqualPw = await util.isEqualPw(pw, accountInfo.pw);
	if (!isEqualPw) {
		throw new Error.IncorrectAccount();
	}

	return true;
};

const add = async (id, pw) => {
	if (!id || !pw) {
		throw new Error.InvalidRequest();
	}

	const isExists = await isExistsById(id);

	if (isExists) {
		throw new Error.AlreadyExists();
	}

	const hashedPw = await util.genHashedPw(pw);
	const newAccountInfo = new modAccount({ id, pw: hashedPw });

	await newAccountInfo.save();
	return true;
};


router.post('/favorin', async (req, res, next) => {
	try {
		const { title, href } = req.body;
		var favor = {"title": req.body.title, "href": req.body.href};
		const r = await modAccount.updateOne( {id : req.session.user.id}, {$push : { favorite : favor } } );
		const ret = await modAccount.find({id : req.session.user.id});
		req.session.data = ret;
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

router.post('/signup', async (req, res, next) => {
	try {
		const { id, pw } = req.body;
		const ret = await add(id, pw);
		res.send(ret);
		
	} catch (err) {
		next(err);
	}
});

router.post('/signin', async (req, res, next) => {
	try {
		const { id, pw } = req.body;
		const ret = await isExistsAccountInfo(id, pw);
		const ret2 = await modAccount.find({id : req.body.id});
		req.session.user = { id };
		req.session.data = ret2;
		res.send(ret);
		
	} catch (err) {
		next(err);
	}
});

router.get('/signout', (req, res) => {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.clearCookie('app.sid', { path: '/' });
		}
		res.redirect('/workspace');
	});
});

router.get('/id', (req, res) => {
	res.send(req.session && req.session.user && req.session.user.id);
});

router.get('/favorup', async (req, res) => {
	res.send(req.session);
});

module.exports = router;