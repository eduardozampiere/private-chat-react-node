import React, {useState} from 'react';
import io from 'socket.io-client';
import Side from '../Side';
import Main from '../Main';
import { Redirect } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const socketMessages = io('http://localhost:3001/');
const socketUsers = io('http://localhost:3001');
const idUser = localStorage.getItem("@chat-id");
const nameUser = localStorage.getItem("@chat-name");

socketMessages.emit('create.room', {idUser, nameUser});

document.title = 'WebChat'
export default function(){
    const [logout, setLogout] = useState(false);
    const [idFriend, setFriend] = useState(null);

    function handleClick(e){
        setLogout(true);
    }

    if(!idUser || !nameUser){
        return <Redirect to={{pathname: '/login'}} />
    }

    if(logout){
        localStorage.removeItem("@chat-name");
        localStorage.removeItem("@chat-id");
        return <Redirect to={{pathname: '/login'}} />
    }

    return (
        <div className="container">
            <header><span>Ola {nameUser}</span> <FiLogOut onClick={handleClick}/> </header>
            <Side sm={socketMessages} su={socketUsers} user={idUser} friend={idFriend} setFriend={setFriend}/>
            <Main sm={socketMessages} user={idUser} friend={idFriend} />
        </div>
    );
}