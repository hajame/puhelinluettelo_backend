const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://user:paaaas@ds133260.mlab.com:33260/fullstack-puhelinkirja'

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

// Person.format = function() {
//     return {
//         name: this.name,
//         number: this.number,
//         id: this._id
//     }
// }

module.exports = Person