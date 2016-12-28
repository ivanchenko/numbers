import React from 'react';

export default class Register extends React.Component {
	constructor(props) {
		super(props);

		this.onRegister = this.onRegister.bind(this);

		this.state = {
			errorMsg: ''
		};
	}

	onRegister() {
		var nick = this.refs.nick.value;
		var name = this.refs.name.value;
		var pass = this.refs.pass.value;

		$.post('/api/register', {nick: nick, name: name, pass: pass})
			.always((res) => {
				if (res.responseJSON) res = res.responseJSON;

				if (res.success) {
					window.location.href = '/'
				} else {
					this.setState({errorMsg: res.message});
				}
			});
	}

	render() {
		return (
			<div className="card ">
				<div className="card-content">
					<span className="card-title black-text">Регистрация</span>

					<p className="red-text">{this.state.errorMsg}</p>

					<div className="row">
						<div className="input-field col s12">
							<input id="nick" type="text" className="validate" ref="nick"/>
							<label htmlFor="nick">НИК</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12">
							<input id="name" type="text" className="validate" ref="name"/>
							<label htmlFor="name">Имя</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12">
							<input id="password" type="password" className="validate" ref="pass"/>
							<label htmlFor="password">Пароль</label>
						</div>
					</div>
				</div>
				<div className="card-action">
					<a href="#" onClick={this.onRegister} className="waves-effect waves-light btn register">Зарегестрироваться</a>
				</div>
			</div>
		);
	}
}