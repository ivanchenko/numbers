'use strict';

import mongoose         from 'mongoose';

var config = require('../config');

var schema = new mongoose.Schema({
	nick: String,
	msg: String,
	date: Date
});

module.exports = mongoose.model('Msg', schema);
