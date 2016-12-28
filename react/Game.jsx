'use strict';

import React from 'react';
var socket = require('socket.io-client')('http://78.47.222.4:8085');


export default class Game extends React.Component {
	constructor(props) {
		super(props);

		this.numbers = props.numbers;
		this.enemy = props.enemy;
		this.user = props.user;
		this.numbers = this.transformNumbers(props.numbers);

		this.changeNumber = this.changeNumber.bind(this);


		this.state = {
			hisLastNumber: 0,
			myLastNumber: 0,
			timer: 0,
		};
	}

	componentDidMount() {
		socket.on('game-start', (data) => {
			if (data.users.indexOf(this.user._id) !== -1) {
				this.interval = setInterval(() => {
					this.setState({timer: this.state.timer + 1})
				}, 100);
			}
		});

		socket.on('number-change', (data) => {
			if (data.userId === this.enemy) {
				this.setState({hisLastNumber: data.number});
			}
		});

		socket.on('game-finish', (data) => {
			if (data.winnerId === this.user._id) {
				this.setState({result: 'win'});
			}

			if (data.loserId === this.user._id) {
				this.setState({result: 'lose'});
			}

			if (data.loserId === this.user._id || data.winnerId === this.user._id) {
				clearInterval(this.interval);
			}
		});

		window.onbeforeunload = (e) => {
			let {result} = this.state;
			if (result == null) {
				socket.emit('game-leave', {userId: this.user._id});
				var message = "Вы уверенны что хотите покинуть игру?",
					e = e || window.event;
				// For IE and Firefox
				if (e) {
					e.returnValue = message;
				}

				// For Safari
				return message;
			}
		}
	}

	changeNumber(number) {
		let {myLastNumber, timer} = this.state;

		if (number - myLastNumber === 1) {
			this.setState({myLastNumber: number});

			socket.emit('send-number', {
				userId: this.user._id,
				enemyId: this.enemy,
				number: number,
				timer: timer
			});
		}
	}

	transformNumbers(numbers) {
		var rows = [];
		var j;
		for (var i = 0; i < 25; i++) {
			j = Math.floor(i / 5);
			if (!Array.isArray(rows[j])) {
				rows[j] = [];
			}

			rows[j].push(numbers[i]);
		}

		return rows;
	}

	render() {
		let {timer, myLastNumber, hisLastNumber, result} = this.state;
		let {numbers} = this;

		return (
			<div className="row">
				<div className="col s12">
					<h2 className="center-align">{`${Math.floor(timer / 10 / 60)} мин ${((timer / 10) % 60).toFixed(1)} cек`}</h2>
				</div>
				<div className="col s12">

					{result === 'win' && (
						<h1>Победа</h1>
					)}
					{result === 'lose' && (
						<h1>Поражение</h1>
					)}

					{(result === 'lose' || result === 'win') && (
						<a href="/">Выход</a>
					)}
				</div>

				{result == null && (
					<div className="col m6">
						<h4 className="center-align">Вы</h4>

						<div className="card card-filed">
							<table className="table-field my-field">
								<tbody>
								{numbers.map((row, j) => {
									return (
										<tr key={j}>
											{row.map((number, i) => {
												return (
													<td
														key={i} onClick={() => this.changeNumber(number)}
														className={myLastNumber >= number ? 'done' : ''}
													>
														{number}
													</td>
												)
											})}
										</tr>
									)
								})}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{result == null && (
					<div className="col m6">
						<h4 className="center-align">Соперник</h4>

						<div className="card card-filed ">
							<table className="table-field his-field">
								<tbody>
								{numbers.map((row, j) => {
									return (
										<tr key={j}>
											{row.map((number, i) => {
												return (
													<td key={i} className={hisLastNumber >= number ? 'done' : ''}>
														{number}
													</td>
												)
											})}
										</tr>
									)
								})}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		)
	}
}
