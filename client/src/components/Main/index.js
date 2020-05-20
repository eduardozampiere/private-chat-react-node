import React, {useState, useEffect} from 'react';

import './Main.css';

function Main(props) {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	
	const socketMessages = props.sm;
	const idUser = props.user;
	const idFriend = props.friend;

	useEffect( () => {
        const handleNewMessage = newMessage =>{
            let {idAuthor} = newMessage[newMessage.length -1];
			
			if(idAuthor === idFriend || idAuthor === idUser){
                return setMessages(newMessage);
            }
            else{
                const li = document.getElementById(idAuthor);
                li.classList.add('newMessage');
                document.title = 'WebChat | Você tem uma nova mensagem!';
            }
        }

        socketMessages.on('chat.message', handleNewMessage)
        
        if(document.querySelector('main > div')){
            document.querySelector('main > div').scrollTo(0,document.querySelector('main > div').scrollHeight);
        }
        return () => socketMessages.off('chat.message', handleNewMessage)        
    }, [messages, socketMessages, idFriend, idUser]);
	

	useEffect(() => {
        if(!idFriend) return () => false; 
        socketMessages.on('chat.chat', function(data){
            setMessages(data);
        });
    }, [idFriend, socketMessages]);
	
	function changeInput(e){
        setMessage(e.target.value);
    }

	function date(data){
        const now = new Date()
        const timeData = data.getTime();
        const timeNow = now.getTime();

        const sec = (timeNow - timeData) / 1000;
        if(sec > 86400){
            return `${data.getDate()}/${data.getMonth()}/${data.getFullYear()}`
        }

        let hours = data.getHours();
        let minutes = data.getMinutes();
        if(hours < 10) hours = '0'+hours;
        if(minutes < 10) minutes = '0'+minutes;
        return `${hours}:${minutes}`
    }



	function submitForm(e){
        e.preventDefault();
        const m = {idUser, idFriend, message};
        if(message.trim()){
            socketMessages.emit("chat.message", m);
            setMessages([]);
            setMessage('');
        }
	}

	function renderChatArea(){
        if(idFriend){
            return(
                <>
                <div>
                    {messages.map(m => {
                        return (
                            <div key={m._id} className={(m.idAuthor === idUser ? `mine` : `friend`)}>
                                <div>
                                    <div> {m.content} </div> 
                                    <div className="date"> { date(new Date(m.createdAt)) } </div>
                                </div>
                            </div>)
                    })}
                </div>
                <form onSubmit={submitForm}>
                    <input placeholder="digite sua mensagem" onChange={changeInput} value={message} />
                </form>
                </>
            )
        }

        return <p className="noChat">Selecione uma conversa</p>
    }


	return (
		<main>
			{renderChatArea()}
		</main>
	);
}

export default Main;