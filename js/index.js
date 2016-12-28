import $ from 'jquery';
window.$ = window.jQuery = $;


import React        from 'react';
import ReactDOM     from 'react-dom';
import Login        from '../react/Login';
import Register     from '../react/Register';
import NavBar       from '../react/NavBar';
import Main         from '../react/Main';
import Game         from '../react/Game';

import 'materialize-css/dist/js/materialize';
import '../css/index.scss'


var props = window.props || {};


$(function () {
	var reactLogin = document.getElementById('react-login');
	if (reactLogin) {
		ReactDOM.render(<Login {...props.login}/>, reactLogin);
	}

	var reactRegister = document.getElementById('react-register');
	if (reactRegister) {
		ReactDOM.render(<Register {...props.register}/>, reactRegister);
	}

	var reactMain = document.getElementById('react-main');
	if (reactMain) {
		ReactDOM.render(<Main {...props.main}/>, reactMain);
	}

	var reactNav = document.getElementById('react-nav');
	if (reactNav) {
		ReactDOM.render(<NavBar {...props.nav} user={props.user}/>, reactNav);
	}


	var reactGame = document.getElementById('react-game');
	if (reactGame) {
		ReactDOM.render(<Game {...props.game}/>, reactGame);
	}

});