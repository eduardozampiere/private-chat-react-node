const database = require('../database/database');

const UserSchema = new database.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    friends: [
        {
            type: database.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    friendsChats: [
        {
            type: database.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    online:{
        Type: Boolean,
        default: false,
    }

}, {
    timestamps: true,
});

module.exports = database.model('User', UserSchema);