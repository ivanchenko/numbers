import User from '../models/User';
import Msg from '../models/Msg';


module.exports = function (server) {
	var io = require('socket.io')(server);

	io.on('connection', function (socket) {

		socket.on('change-search', function (data) {
			User
				.update(
					{_id: data.userId},
					{$set: {status: data.search ? 'search' : 'wait'}}
				)
				.then(function () {
					if (data.search) {
						return User.find({status: 'search', _id: {$ne: data.userId}})
					}
				})
				.then(function (users) {
					if (users && users.length > 0) {
						console.log('start');

						io.sockets.emit('start-game', {
							users: [users[0]._id, data.userId]
						});

						setTimeout(function () {
							io.sockets.emit('game-start', {
								users: [users[0]._id, data.userId]
							});
						}, 2000);

						return User.updateMany({
							$or: [
								{_id: users[0]._id},
								{_id: data.userId}
							]
						}, {
							$set: {status: 'game'}
						})
					}
				})
				.catch(function () {

				});
		});

		socket.on('send-number', function (data) {
			socket.broadcast.emit('number-change', data);

			if (data.number === 25) {
				io.sockets.emit('game-finish', {
					winnerId: data.userId,
					loserId: data.enemyId,
				});

				User.update(
					{_id: data.userId},
					{
						$set: {status: 'wait'},
						$push: {
							games: {
								result: 'win',
								duration: data.timer,
								enemyId: data.enemyId,
							}
						}
					}
				).then(function () {

				});
				User.update(
					{_id: data.enemyId},
					{
						$set: {status: 'wait'},
						$push: {
							games: {
								result: 'lose',
								duration: data.timer,
								enemyId: data.userId,
							}
						}
					}
				).then(function () {

				});
			}
		});

		socket.on('msg-send', function (msg) {
			io.sockets.emit('msg-recive', msg);

			msg.date = new Date();
			var m = new Msg(msg);
			m.save(() => {

			});
		});

		socket.on('game-leave', function (data) {
			io.sockets.emit('game-finish', {
				winnerId: data.enemyId,
				loserId: data.userId,
			});
			User.update(
				{_id: data.enemyId},
				{
					$set: {status: 'wait'},
					$push: {
						games: {
							result: 'win',
							duration: data.timer,
							enemyId: data.userId,
						}
					}
				}
			).then(function () {

			});
			User.update(
				{_id: data.userId},
				{
					$set: {status: 'wait'},
					$push: {
						games: {
							result: 'lose',
							duration: data.timer,
							enemyId: data.enemyId,
						}
					}
				}
			).then(function () {

			});
		})
	});
};
