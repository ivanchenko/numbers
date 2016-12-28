import React from 'react';

export default class NavBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	onLogout(e) {
		e.preventDefault();

		$.post('/api/logout').always(function (res) {
			if (res.success) {
				window.location.href = '/login'
			}
		});
	}

	render() {
		return (
			<nav>
				<div className="nav-wrapper">
					<div className="container">
						<div className="row">
							<div className="col s12">
								<a href="/" className="brand-logo">Числа</a>
								<ul id="nav-mobile" className="right hide-on-med-and-down">
									<li>
										<a href="/logout" onClick={this.onLogout}>Выйти</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</nav>
		)
	}
}