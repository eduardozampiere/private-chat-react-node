import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import swal from 'sweetalert2';

import api from '../../api/chat';

import './Logon.css';
function Logon() {

	const [auth, setAuth] = useState(false);
	const [loading, setLoading] = useState(true);
    
    const [email, setEmail] = useState('');
	const [name, setName] = useState('');
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
		if(email && password && name){
			button.classList.add('clickable');
			button.classList.remove('unclickable');
		}
		else if(button){
			button.classList.add('unclickable');
			button.classList.remove('clickable');
		}
	}, [email, password, name]);


	function handleChange(e, set){
		set(e.currentTarget.value);
	}

	function handleSubmit(e){
		e.preventDefault();
		if(!email || !password) return false;

		api.post('/logon', {email, password, name}).then(r => {
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
		<div className="logon-content">
			<div className="logon-header">Log On</div>
			<div className="logon-body">
				<form method="post" onSubmit={handleSubmit}>
					<input type="text" value={name} onChange={(e) => handleChange(e, setName)} name="name" autoComplete="off" placeholder="Nome" />
					<input type="text" value={email} onChange={(e) => handleChange(e, setEmail)} name="email" autoComplete="off" placeholder="Email" />
					<input type="password" value={password} onChange={(e) => handleChange(e, setPassword)} name="password" placeholder="Senha" autoComplete="off" />
					<button className="unclickable">logon</button>
				</form>
				<div className="cadastrar">
					<Link to="/login">
						Ja tem um cadastro? Faça seu login!
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Logon;