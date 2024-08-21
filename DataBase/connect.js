const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/company')
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((error) => {
        console.error('Error connecting to DB:', error);
    });
