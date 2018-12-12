const mongoose = require('mongoose')
const Schema = mongoose.Schema

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = process.env.MONGODB_URI
// const url = 'mongodb://user:pass@ds133260.mlab.com:33260/fullstack-puhelinkirja'

mongoose.connect(url, { useNewUrlParser: true })

let personSchema = new Schema({
  name: String,
  number: String
})

personSchema.statics.format = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person