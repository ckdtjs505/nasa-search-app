const mongoose = require('mongoose');

const schema = {
	id: String,
	pw: String,
	favorite: [{
		title : String,
		href : String,
	}]
	
};

module.exports = mongoose.model('account', schema);