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

app.get('/info', (req, res) => {
  Person.find({})
    .then(people => {
      res.send(`<p>puhelinluettelossa ${people.length} henkilön tiedot</p>
            <p>${new Date()}</p>`)
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(people => {
      return people.map(Person.format)
    })
    .then(formattedPeople => {
      res.json(formattedPeople)
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
        response.json(Person.format(person))
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
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  Person.find({ name: body.name })
    .then(foundPerson => {
      console.log('foundPerson', foundPerson)
      if (foundPerson.length !== 0) {
        return response.status(400).json({ error: 'name must be unique' }).end()
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })
        person
          .save()
          .then(Person.format)
          .then(savedAndFormattedPerson => {
            response.json(savedAndFormattedPerson)
          })
          .catch(error => {
            console.log(error)
          })
      }
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
    .findOneAndUpdate({ _id: request.params.id }, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})