import React, {useState, useEffect} from 'react';
import {FcPlus} from 'react-icons/fc';

import api from '../../api/chat';

import './Search.css';

function Search(prop) {
	const [search, setSearch] = useState('');
	const [retSearch, setRetSeach] = useState([]);
	const friends = prop.friends;
	const socketUsers = prop.su;
	const idUser = localStorage.getItem('@chat-id');
	

	useEffect( () => {
        if(search && search.length >= 3){
            console.log('indo')
            
            api.post('/search', {name: search}).then(r => {
				setRetSeach(r.data);
            }).catch(err => {
                console.log(err.response);
            });    
        }
	}, [search]);
	
	function handleSearch(e){
        const value = e.currentTarget.value;
        setSearch(value);
	}

	function handleClick(e, id){
		setSearch('');
		api.post('/make-friend', {idUser, idFriend: id}).then(r => {
			socketUsers.emit('chat.update', {_id: idUser});

		}).catch(err => {
			console.log(err.response);
		});
	}
	
	function renderRetSearch(){
        if(search.length < 3) return (<ul></ul>);
        if(retSearch.length <= 0 && search.length >= 3) return <p>Nenhum usuario encontrado</p>    
        return (
            <ul>
                {
                    retSearch.map(f => {
						if(f._id !== idUser){
							if(friends.indexOf(f._id) === -1){
								return <li key={f._id} id={f._id} ><span>{f.name}</span> <FcPlus onClick={(e) => handleClick(e, f._id)} size={20}/></li>
							}
						}
                    })
                }
            </ul>
		)
    }
	
	return (
		<div className="searchUsers">
            <form>
                <input type="text" value={search} onChange={handleSearch} placeholder="Busque por amigos novos"/>
                {
                    renderRetSearch()
                }
            </form>
        </div>
	);
}

export default Search;