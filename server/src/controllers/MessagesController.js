const Messages = require('../models/Messages');
class Controller{
    async openChat(obj){
        const {idFriend, idUser} = obj;
        const news = await Messages.updateMany({
            new: true,
            idTo: obj.idUser,
            idAuthor: obj.idFriend,
        }, {new: false}, {multi: true});


        const m = await Messages.find({
            $or: [
                {$and: [
                    {idAuthor: obj.idUser},
                    {idTo: obj.idFriend}
                ]},
                {$and: [
                    {idTo: obj.idUser},
                    {idAuthor: obj.idFriend}
                ]},
            ]
        });

        return m;
    }
    
    async chat(obj){
        const {idFriend, idUser, msg} = obj;
        const m = await Messages.create({idAuthor: obj.idUser, idTo: obj.idFriend, content: obj.message});
        return m;
    }
}

module.exports = new Controller();
