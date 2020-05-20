const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('MongoDB connected!');
}).catch(err => {
    console.log('Error in MongoDB connection');
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose;