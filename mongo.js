const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password  = process.argv[2];
const name      = process.argv[3];
const number    = process.argv[4];

const url = `mongodb+srv://phonebook-part3:${password}@cluster0.4qp2b.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    number: {
        type: String,
        trim: true,
        required: 'Number is required'
    }
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: name,
    number: number
});

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => console.log(`${person.name} ${person.number}`));
        mongoose.connection.close();
    });
} else {
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to the phonebook`);
        mongoose.connection.close();
    }, err => {
        console.log(err);
    });
}