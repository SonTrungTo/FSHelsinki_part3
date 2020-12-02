const express = require('express');
const app = express();

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
];

const generateId = () => {
    return Math.round(Math.random() * new Date().valueOf());
};

app.use(express.json());
app.get('/api/persons', (req, res) => {
    return res.json(persons);
});
app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
});
app.get('/api/persons/:personId', (req, res) => {
    let id = Number(req.params.personId);
    let person = persons.find(person => person.id === id);

    if (person) {
        return res.json(person);
    } else {
        return res.status(404).end(`Error 404: Resource does not exist`);
    }
});
app.delete('/api/persons/:personId', (req, res) => {
    let id = Number(req.params.personId);
    persons = persons.filter(person => person.id !== id);

    return res.status(204).end();
});
app.post('/api/persons', (req, res) => {
    let body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "Missing name or number"
        });
    } else if (persons.findIndex( person => person.name === body.name ) !== -1) {
        return res.status(400).json({
            error: "Name must be unique"
        });
    }

    let person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    return res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running now on ${PORT}`);
});