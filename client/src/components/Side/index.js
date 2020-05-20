import React, {useState, useEffect} from 'react';

import Search from '../Search';
import swal from 'sweetalert2';
import './Side.css';
import { FaSortAlphaDownAlt } from 'react-icons/fa';
// import { Container } from './styles';

function Side(props) {
    const [friends, setFriends] = useState([]);
    const [update, setUpdate] = useState('');
    const setFriend = props.setFriend;	
	const socketMessages = props.sm;
	const socketUsers = props.su;
	const idUser = props.user;
	
	useEffect(() => {
        socketUsers.emit('chat.friends', {_id: idUser});
        socketUsers.on('chat.friends', data => {
            setFriends(data);
        });
    }, [idUser, update]);

    useEffect( () => {
        socketUsers.on('chat.update', data => {
            // socketUsers.emit('chat');
            setUpdate(new Date());
        });

        socketMessages.on('chat.online', data => {
            swal.fire({
                title: data.nameUser + " acabou de ficar online",
                icon: 'info'
            });
        });
    }, [socketUsers]);

	function setFriendHandler(e, idFriend){
        const liCurrent = e.currentTarget;
        const lis = document.querySelectorAll("aside > ul > li");
        for(let i = 0; i < lis.length; i++){
            let li = lis[i];
            li.classList.remove('selected');
        }

        liCurrent.classList.add('selected');
        liCurrent.classList.remove('newMessage');
        document.title = 'WebChat';
        setFriend(idFriend);
        socketMessages.emit('chat.chat', {idFriend, idUser});
    }

	function renderFriends(){
        if(friends.length <= 0 ) return <p>Voce ainda não tem nenhum amigo</p>    
        return (
            <ul>
                {
                    friends.map(f => {
                        return <li key={f.id} id={f.id} className={(f.new) ? "newMessage" : ""} onClick={(e) => setFriendHandler(e, f.id)} >{f.name}</li>
                    })
                }
            </ul>
        )
    }
	
	return (
		<aside>
			<div>
                <span>Amigos</span>
            </div>
			{
				renderFriends()
			}
            <Search friends={friends.map(f => f.id)} su={socketUsers}/>
        </aside>
	);
}

export default Side;