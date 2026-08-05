const mongoose = require('mongoose')

// const password = process.argv[2]
// const mongo_url = `mongodb+srv://rymerkih:${password}@cluster0.1zqhghm.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

const mongo_url = 'mongodb://127.0.0.1:27017/phoneBook'

mongoose.connect(mongo_url)

const personSchema = new mongoose.Schema({
  number: String,
  name: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
// If exactly 3 arguments (node, mongo.js, password), list the phonebook
if(process.argv.length == 3){
  Person.find({}).then(
    people=>{
      console.log("phonebook:")
      people.forEach(person=>{
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  return
}

// Catch the error where they provide a name but no number (4 arguments)
if (process.argv.length === 4) {
  console.log('Please provide both name and number to save: node mongo.js <password> <name> <number>')
  process.exit(1)
}

// when all arguments (5 arguments) are provided. Save the contact.
const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then((result)=>{
  console.log(`added ${result.name} ${result.number} to phonebook`)
  mongoose.connection.close()
})