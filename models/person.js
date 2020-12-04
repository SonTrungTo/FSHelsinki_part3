require('dotenv').config();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGO_URI;

console.log('connecting to', url);

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(result => {
    console.log('Connected to MongoDB Atlas');
}).catch(error => {
    console.log('error to connecting to MongoDB:', error.message);
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        trim: true,
        required: 'Number is required',
        match: [/\d{8,}/, 'Number has at least 8 digits']
    }
});

personSchema.plugin(uniqueValidator);
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);