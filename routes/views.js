import React            from 'react';
import {renderToString} from 'react-dom/server';
import Main             from '../react/Main';
import Game             from '../react/Game';
import NavBar           from '../react/NavBar';
import User             from '../models/User';
import Msg             from '../models/Msg';


var router = require('express').Router();


router.get('/', function (req, res) {
	var props = {
		main: {
			user: res.locals.user
		},
		user: res.locals.user
	};

	User.find({}).then(function (users) {
		props.main.dashboard = users.map((u) => {
			let wins = 0, lose = 0, duration = 0;

			u.games.map((g) => {
				if (g.result === 'win') {
					wins++
				} else {
					lose++;
				}

				duration += g.duration;
			});

			return {
				_id: u._id,
				nick: u.nick,
				name: u.name,
				wins: wins,
				lose: lose,
				avgDuration: duration / u.games.length
			}
		});

		props.main.dashboard = props.main.dashboard.sort((a, b) => {
			return b.wins - a.wins;
		});

		Msg.find({}).sort({date: 1}).limit(100).then(function (msgs) {
			props.main.messages = msgs;

			res.render('index', {
				title: 'Поиск игры',
				props: JSON.stringify(props),
				reactNav: renderToString(<NavBar user={res.locals.user}/>),
				reactMain: renderToString(<Main {...props.main} />)
			});
		});
	});
});


router.get('/game', function (req, res) {
	var {enemy} =  req.query;

	var numbers = [];
	for (var i = 0; i < 25; i++) {
		numbers[i] = i + 1;
	}

	for (i = 0; i < 25; i++) {
		var a = Math.floor(Math.random() * 25);
		var b = numbers[i];
		numbers[i] = numbers[a];
		numbers[a] = b;
	}

	var props = {
		game: {
			user: res.locals.user,
			numbers: numbers,
			enemy: enemy
		},
		user: res.locals.user
	};

	User.update(
		{_id: res.locals.user._id},
		{$set: {status: 'wait'}}
	).then(function () {
		res.render('game', {
			title: 'Игра',
			props: JSON.stringify(props),
			reactNav: renderToString(<NavBar user={res.locals.user}/>),
			reactGame: renderToString(<Game {...props.game} />)
		});
	});
});


module.exports = router;