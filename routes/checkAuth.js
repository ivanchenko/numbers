'use strict';

import User     from '../models/User';
import async    from 'async';
import mongoose from 'mongoose';


function authorize(req, res, next) {
	var requestedUrl = req.url;

	async.waterfall([
		function (callback) {
			if (req.session.userId) {
				User.findById(req.session.userId).exec(callback);
			} else {
				callback({
					success: false,
					message: 'No such user'
				});
			}
		},
		function (user, callback) {
			res.locals.user = user;

			if (requestedUrl === '/login' && user) {
				return res.redirect('/');
			}

			callback(null, {success: true});
		}
	], function (err, result) {
		if (err) {
			if (requestedUrl === '/') {
				return res.status(303).redirect('/login');
			}
		}

		next();
	});
}

module.exports = authorize;