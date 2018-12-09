const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

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
    console.log('persons')
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(pers => pers.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).send(`<h2>So, So Sorry...</h2>
            <p>404: person with id ${id} not found</p>`).end()
    }
})

const generateId = () => {
    // const maxId = persons.length > 0 ? persons.map(p => p.id)
    //     .sort((a, b) => a - b).reverse()[0] : 1
    // return maxId + 1
    return Math.floor(Math.random() * 10000) + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name or number missing' })
    } else if (persons.map(pers => pers.name).includes(body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(pers => pers.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})