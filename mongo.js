const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://<user>:<password>@ds133260.mlab.com:33260/fullstack-puhelinkirja'

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv[2] !== undefined && process.argv[3] !== undefined) {
    const person = new Person({
      name: process.argv[2],
      number: process.argv[3],
    })
    
    person
      .save()
      .then(result => {
        console.log(`lisätään henkilö ${result.name} numero ${result.number} luetteloon!`)
        mongoose.connection.close()
      })
} else {
    console.log('puhelinluettelo:')
    Person
      .find({})
      .then(result => {
        result.forEach(person => {
          console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
      })
}
