'use strict';

import Validator        from '../js/validator';
import mongoose         from 'mongoose';
import Promise          from 'bluebird'

var crypto = require('crypto');
var config = require('../config');

var schema = new mongoose.Schema({
	nick: {
		type: String,
		unique: true,
		required: true
	},
	name: {type: String, required: true},
	hashedPassword: {type: String, required: true},
	salt: {type: String, required: true},

	status: {
		type: String,
		default: 'wait',
		enum: ['search', 'game', 'wait', 'offline']
	},

	games: [{
		result: {
			type: String,
			enum: ['win', 'lose']
		},
		enemyId: mongoose.Schema.Types.ObjectId,
		duration: Number
	}]
});

schema.virtual('password')
	.set(function (password) {
		this.plainPassword = password;
		this.salt = Math.random().toString();
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function () {
		return this.plainPassword;
	});

schema.methods.encryptPassword = function (password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function (password) {
	return this.hashedPassword === this.encryptPassword(password);
};

schema.statics.validate = function (user) {
	var validator = new Validator();

	validator.config = {
		nick: {type: 'isNonEmpty', message: 'Ник обязательное поле'},
		name: {type: 'isNonEmpty', message: 'Имя и фамилия обязательное поле'},
		password: {type: 'isNonEmpty', message: 'Пароль обязательное поле'}
	};
	validator.validate(user);

	if (validator.isValid) {
		return {
			success: true,
			user: user
		}
	} else {
		return {
			success: false,
			message: 'Неправильные данные пользователя.',
			errors: validator.messages
		}
	}
};

schema.statics.authorise = function (email, password, callback) {
	var User = this;

	if (!email || !password) {
		callback({
			success: false,
			message: 'Неправильный пароль'
		});
	}

	User.findOne({nick: email})
		.then(function (user) {
			if (user == null) {
				callback({
					success: false,
					message: 'Нет такого пользователя'
				});
				return;
			}
			if (user.checkPassword(password)) {
				callback(null, {
					success: true,
					user: user
				});
			} else {
				callback({
					success: false,
					message: 'Неправильный логин или пароль'
				});
			}

		});
};


module.exports = mongoose.model('User', schema);