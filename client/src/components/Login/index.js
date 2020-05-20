import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import swal from 'sweetalert2';

import api from '../../api/chat';

import './Login.css';
function Login() {

	const [auth, setAuth] = useState(false);
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// localStorage.removeItem("@chat-id");
	useEffect( () => {
		if(localStorage.getItem('@chat-id')){
			setAuth(true);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		const button = document.getElementsByTagName('button')[0];
		if(email && password){
			button.classList.add('clickable');
			button.classList.remove('unclickable');
		}
		else if(button){
			button.classList.add('unclickable');
			button.classList.remove('clickable');
		}
	}, [email, password]);


	function handleChange(e, set){
		set(e.currentTarget.value);
	}

	function handleSubmit(e){
		e.preventDefault();
		if(!email || !password) return false;

		api.post('/login', {email, password}).then(r => {
			localStorage.setItem("@chat-id", r.data._id);
			localStorage.setItem("@chat-name", r.data.name);
			console.log(r.data);
			setAuth(true);
		}).catch(err => {
			swal.fire({
				text: err.response.data.error,
				icon: 'error'
			});
		});
	}

	if(loading){
		return <p>Loading</p>
	}
	if(auth){
		document.location.href = "/";
		//Preferi usar o location para atualizar as credenciais do usuario quando abrir o chat
	}
	return (
		<div className="login-content">
			<div className="login-header">Log In</div>
			<div className="login-body">
				<form method="post" onSubmit={handleSubmit}>
					<input type="text" value={email} onChange={(e) => handleChange(e, setEmail)} name="email" autoComplete="off" placeholder="Email" />
					<input type="password" value={password} onChange={(e) => handleChange(e, setPassword)} name="password" placeholder="Senha" autoComplete="off" />
					<button className="unclickable">Login</button>
				</form>
				<div className="cadastrar">
					<Link to="/logon">
						Não tem um usuario? Faça seu cadastro!
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;