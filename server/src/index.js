const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = 3001;
const HOST = 'localhost'

const routes = require('./routes/routes');
const UserController = require('./controllers/UserController');
const MessageController = require('./controllers/MessagesController');

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(routes);

let online = [];

io.on('connection', s => {
    let client = {id: s.client.id, room: undefined}
    s.on('create.room', data => {
        let {idUser, nameUser} = data; 
        client.room = idUser;
        s.join(client.room);
        online.push(client);
        s.emit('create.room', client.id);
        UserController.onlineFriend({_id: idUser}).then(r => {
            r.forEach( f => {
                online.forEach(o => {
                    if(o.room === f.id){
                        s.to(o.room).emit("chat.online", data);
                    }
                });
            });
        })

    });
    
    s.on('chat.message', data => {
        MessageController.chat(data).then(r => {
            MessageController.openChat({idUser: data.idUser, idFriend: data.idFriend}).then(c => {
                s.emit("chat.message", c);
                online.forEach( el =>{
                    if(el.room === data.idFriend){
                        s.to(el.room).emit("chat.message", c);
                    }
                });
            })
        });
    });
    
    s.on('chat.chat', data => {
        MessageController.openChat(data).then(r => {
            s.emit('chat.chat', r);
        });
    })

    s.on('chat.friends', data => {
        UserController.onlineFriend(data).then(r => {
            r.forEach(f => {
                online.forEach(el => {
                    if(el.room === f.id){
                        f.online = true;
                    }
                });
            });
            s.emit('chat.friends', r);
        })
    });

    s.on('chat.update', data => {
        io.emit('chat.update', 'oi');
    });
    
    s.on('disconnect', () => {
        let offline = undefined;
        let offlineId = undefined;
        for(i in online){
            const el = online[i];
            if(el.id === s.client.id){
                offline = i;
                offlineId = el.room;
                break;
            }
        }

        if(offline){
            online.splice(offline, 1);
            
            UserController.onlineFriend({_id: offlineId}).then(r => {
                r.forEach(f => {
                    online.forEach(el => {
                        if(el.room === f.id){
                            console.log('tenho amigos online');
                            s.to(el.room).emit("chat.offline", {idUser: offlineId} );
                        }
                    });
                });
            });
        
        }
    });
});





server.listen(PORT, HOST, function(){
    console.log(`Listen at: http://${HOST}:${PORT}`)
});