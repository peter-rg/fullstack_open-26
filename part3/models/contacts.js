const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGODB_URL

console.log("connecting to", MONGO_URL)
mongoose.connect(MONGO_URL)
  .then(result => console.log("connected to MongoDB"))
  .catch(err=> console.log('error connecting to MongoDB', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObj)=>{
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj.__v
    delete returnedObj._id
  }
})

module.exports = mongoose.model('Person', personSchema)