import React from 'react';


export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.onLogin = this.onLogin.bind(this);

		this.state = {
			errorMsg: ''
		};
	}

	componentDidMount() {
	}

	onLogin() {
		var nick = this.refs.nick.value;
		var pass = this.refs.pass.value;

		$.post('/api/login', {nick: nick, pass: pass})
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
					<span className="card-title black-text">Вход</span>
					<p className="red-text">{this.state.errorMsg}</p>
					<div className="row">
						<div className="input-field col s12">
							<input id="nick" type="text" className="validate" ref="nick"/>
							<label htmlFor="nick">НИК</label>
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
					<a href="#" onClick={this.onLogin} className="waves-effect waves-light btn login">Войти</a>

					<a className="right register" href="/register">Нет аккаунта</a>
				</div>
			</div>
		);
	}
}