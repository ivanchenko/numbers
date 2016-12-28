"use strict";

import React    from 'react';
// var socket = require('socket.io-client')('http://78.47.222.4:8085');
var socket = require('socket.io-client')('http://localhost:8085');

export default class Main extends React.Component {
	constructor(props) {
		super(props);

		this.switchGame = this.switchGame.bind(this);
		this.sendMsg = this.sendMsg.bind(this);

		this.user = props.user;

		this.state = {
			search: false,
			messages: props.messages || []
		};

	}

	componentDidMount() {
		this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;

		socket.on('start-game', (data) => {
			console.log('start-game', data);
			var i = data.users.indexOf(this.user._id);

			if (i !== -1) {
				window.location.href = `/game?enemy=${data.users[Math.abs(i - 1)]}`;
			}
		});

		socket.on('msg-recive', (msg) => {
			let {messages} = this.state;
			messages.push(msg);

			if (messages.length > 1000) {
				messages.shift();
			}

			this.setState({messages: messages});
			this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
		})
	}

	sendMsg(e) {
		e.preventDefault();
		var msg = this.refs.msg.value;

		socket.emit('msg-send', {msg: msg, nick: this.user.nick});

		this.refs.msg.value = '';
		return false;
	}

	switchGame() {
		var {search} = this.state;
		search = !search;

		socket.emit('change-search', {
			search: search,
			userId: this.user._id
		});

		this.setState({search: search});
	}

	render() {
		var {search, messages} = this.state;
		var {dashboard} = this.props;

		return (
			<div className="row">
				<div className="col s12">
					<div className="wrapper-search">
						<button type="button" onClick={this.switchGame}
						        className="waves-effect waves-light btn btn-play">
							{search ? 'Поиск' : 'Играть'}
							{search &&
							<div className="preloader-wrapper small active">
								<div className="spinner-layer spinner-blue-only">
									<div className="circle-clipper left">
										<div className="circle"></div>
									</div>
									<div className="gap-patch">
										<div className="circle"></div>
									</div>
									<div className="circle-clipper right">
										<div className="circle"></div>
									</div>
								</div>
							</div>}
						</button>
					</div>
				</div>
				<div className="col s12 m8">
					<h4>Лидеры</h4>
					<table className="leaders-table">
						<thead>
						<tr>
							<th>Ник</th>
							<th>Имя</th>
							<th>Побед</th>
							<th>Поражений</th>
							<th>Среднее время</th>
						</tr>
						</thead>

						<tbody>
						{dashboard.map((user, i) => {
							return (
								<tr key={i} className={user._id === this.user._id ? 'me' : ''}>
									<th>{user.nick}</th>
									<th>{user.name}</th>
									<th>{user.wins}</th>
									<th>{user.lose}</th>
									<th>{`${((user.avgDuration / 10)).toFixed(1)} cек`}</th>
								</tr>
							)
						})}
						</tbody>
					</table>
				</div>

				<div className="col s12 m4">
					<div className="chat-window" ref="chatWindow">
						{messages.map((msg, i) => {
							return (
								<p className={"msg " + (msg.nick === this.user.nick ? 'my' : '')} key={i}>
									<b>{msg.nick}: </b>{msg.msg}
								</p>
							)
						})}
					</div>
					<form onSubmit={this.sendMsg} className="chat-form row">
						<input type="text" placeholder="Сообщение..." ref="msg" className="col s10"/>
						<button className="btn waves-effect waves-light col s2" type="submit" name="action">
							<i className="material-icons right">send</i>
						</button>
					</form>
				</div>
			</div>
		)
	}
}
