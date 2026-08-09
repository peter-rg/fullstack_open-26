const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGODB_URL

console.log('connecting to', MONGO_URL)
mongoose.connect(MONGO_URL)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Username is required']
  },
  number: {
    type:String,
    minLength: 8,
    validate: {
      validator:  function(v){
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! \nit should be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers`
    },
    required: [true, 'User phone number required!']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj.__v
    delete returnedObj._id
  }
})

module.exports = mongoose.model('Person', personSchema)