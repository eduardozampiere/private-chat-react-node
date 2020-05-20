const database = require('../database/database');

const MessageSchema = new database.Schema({
    idAuthor:{
        type: database.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    idTo:{
        type: database.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    content:{
        type: String,
        require: true
    },

    new: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = database.model('Messages', MessageSchema);
