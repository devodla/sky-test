const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sky-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Database is connected'));
