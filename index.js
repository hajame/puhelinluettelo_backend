const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('type', function (req, res) {
    return req.headers['content-type']
})

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        JSON.stringify(req.body),
        JSON.stringify(req.body).length, '-',
        tokens['response-time'](req, res), 'ms', '-',
        tokens['type'](req, res)
    ].join(' ')
}))

let persons = [
    {
        id: 1,
        number: "040-123456",
        name: "Arto Hellas"
    },
    {
        id: 2,
        number: "040-123456",
        name: "Martti Tienari"
    },
    {
        id: 3,
        number: "040-123456",
        name: "Arto Järvinen"
    },
    {
        id: 4,
        number: "040-123456",
        name: "Lea Kutvonen"
    }
]

app.get('/info', (req, res) => {
    res.send(`
    <p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.json(people.map(person => Person.format(person)))
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(formatPerson(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name or number missing' })
    } else if (persons.map(pers => pers.name).includes(body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
        .catch(error => {
            console.log(error)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(pers => pers.id !== id)

    // response.status(204).end()
    Person
        .findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })

})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findOneAndUpdate({ _id: request.params.id }, person, {new: true})
        .then(updatedPerson => {
            response.json(formatPerson(updatedPerson))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})