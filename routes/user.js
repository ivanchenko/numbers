"use strict";

import React            from 'react';
import {renderToString} from 'react-dom/server';
import User             from '../models/User';
import Login            from '../react/Login';
import Register         from '../react/Register';
import Promise          from 'bluebird';

var router = require('express').Router();


router.get('/login', function (req, res) {
	var props = {
		login: {}
	};

	res.render('login', {
		props: JSON.stringify(props),
		title: 'Вход',
		reactLogin: renderToString(<Login/>)
	})
});

router.get('/register', function (req, res) {
	var props = {
		register: {}
	};

	res.render('register', {
		props: JSON.stringify(props),
		title: 'Регистрация',
		reactRegister: renderToString(<Register/>)
	})
});

router.post('/api/login', function (req, res) {
	var {nick, pass} = req.body;

	User.authorise(nick, pass, function (err, result) {
		if (err) {
			res.status(400).json(err);
		} else {
			req.session.userId = result.user._id;
			res.status(200).json(result);
		}
	});
});

router.post('/api/register', function (req, res) {
	var {nick, name, pass} = req.body;

	User.findOne({nick: nick})
		.then(function (user) {
			if (user) {
				throw {
					success: false,
					message: 'Такой пользввтель уже существует'
				}
			} else {
				var user = new User({nick: nick, name: name, password: pass});
				return user.save();
			}
		})
		.then(function (user) {
			req.session.userId = user._id;

			res.status(200).json({
				success: true,
				user: user
			})
		})
		.catch(function (err) {
			res.status(400).json({
				success: false,
				message: err.message || 'Не получилось зарегестрироваться'
			})
		})
});

router.post('/api/logout', function (req, res) {
	User.update(
		{_id: res.locals.user._id},
		{status: 'offline'}
	).then(function () {
		req.session.destroy();
		res.status(200).json({success: true});
	});
});

module.exports = router;