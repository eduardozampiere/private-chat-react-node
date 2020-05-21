const User = require('../models/User');
const Messages = require('../models/Messages');
class Controller{
	async logon(req, res){
		const {name, email, password} = req.body;
		if(!name){
			return res.status(500).send({error: "Usuario precisa ter um nome"});
		}

		if(!email){
			return res.status(500).send({error: "Usuario precisa ter um email"});
		}

		if(!password){
			return res.status(500).send({error: "Usuario precisa ter uma senha"});
		}

		let user;
		try{
			user = await User.findOne({email});
			if(user) return res.status(400).send({error: "Usuario já cadastrado"})
			
			user = await User.create({name, email, password});
			return res.send(user);

		}catch(err){
			return res.status(500).send({error: "Houve um erro interno"});
		}
	}

	async login(req, res){
		const {email, password} = req.body;
		const user = await User.findOne({email, password});
		

		if(!user){
			return res.status(400).send({error: "Nenhum usuario encontrado"});
		}

		return res.send(user);

	}

	async makeFriend(req, res){
		const {idUser, idFriend} = req.body;
		let user;
		try{
			user = await User.findOne({_id: idUser});

			if(user.friends.indexOf(idFriend) > -1) return res.status(400).send({error: "Ja são amigos"});
			
			user.friends.push(idFriend);
			await user.save();
		
			let friend = await User.findOne({_id: idFriend});
			
			friend.friends.push(idUser);
			await friend.save();
		}
		catch(err){
			// console.log(err);
		}
		
		const r = await new Controller().onlineFriend({_id: idUser});
		return res.send(r);
	}


	async onlineFriend(obj){
		const {_id} = obj;
		if(!_id) return [];
		let users = await User.findOne({_id}).populate('friends');
		let friends = [];

		for(let i in users.friends){
			let friend = users.friends[i];
			let lastMessage = await Messages.find({idAuthor: friend.id, idTo: _id}).limit(1).sort({_id: -1});
			// console.log(lastMessage);
			friends.push({
				id: friend.id,
				name: friend.name,
				new: (lastMessage && lastMessage[0] && lastMessage[0].new)
			});
		}

		return (friends);
	}

	async search(req, res){
		const {name} = req.body;
		
		const s = await User.find({
			name: new RegExp(name, 'i'),
		});
		
		return res.send(s);
	}
}

module.exports = new Controller();