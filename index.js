const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
morgan.token('body', (req, res) => {
    console.log(JSON.stringify(req.body));
});
app.use(morgan(':body'));
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});
app.get('/info', (req, res) => {
    Person.find({})
    .then(result => {
        res.send(`<p>Phonebook has info for ${result.length} people</p>
        <p>${new Date()}</p>`);
    });
});
app.get('/api/persons/:personId', (req, res, next) => {
    Person.findById(req.params.personId)
    .then(result => {
        return res.json(result);
    })
    .catch(error => next(error));
});
app.delete('/api/persons/:personId', (req, res, next) => {
    Person.findByIdAndDelete(req.params.personId)
    .then(result => {
        return res.status(204).end();
    })
    .catch(error => next(error));
});
app.post('/api/persons', (req, res, next) => {
    let newPerson = new Person(req.body);
    newPerson.save().then(result => {
        return res.json(result);
    })
    .catch(error => next(error));
});
app.put('/api/persons/:personId', (req, res, next) => {
    Person.findByIdAndUpdate(req.params.personId, {
        number: req.body.number
    }, {new: true, runValidators: true})
    .then(result => {
        return res.json(result);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
    return res.status(404).json({
        error: 'Unknown endpoint'
    });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.name, err.message);

    for (const errName in err.errors) {
        if (err.errors[errName].message) {
            let message = err.errors[errName].message;
            return res.status(400).json({
                error: message
            });
        }
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            error: err.message
        });
    }

    next(err);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running now on ${PORT}`);
});