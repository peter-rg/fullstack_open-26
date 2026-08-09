const express = require('express')
const morgan = require('morgan')
const Person = require('./models/contacts')
const path = require('path')
const app = express()
app.use(express.json())

// Ex 3.8
morgan.token('post', (req) => (
  req.method ==='POST'? JSON.stringify(req.body)|| ' ' : ' '
))
//formated string format for morgan
const tinyWithBody = ':method :url :status :res[content-length] -:response-time ms :post'

// EX 3.7
app.use(morgan(tinyWithBody))

app.use(express.static('dist'))

// EX 3.1
app.get('/api/persons', (req,res, next) => {
  // EX 3.13
  Person.find({})
    .then(contacts => res.status(200).json(contacts))
    .catch(err => next(err))
})
app.get('/info', (req,res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.status(200).send(`Phonebook has info for ${count} people <br/><br/> ${Date()}`)
    })
    .catch(err => next(err))
})
app.get('/api/persons/:id', (req,res, next) => {
  Person.findById(req.params.id)
    .then(contact => {
      if(!contact){
        return res.status(404).end()
      }
      res.status(200).json(contact)
    })
    .catch(error => next(error))
})
// EX 3.4
app.delete('/api/persons/:id', (req,res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

const validatePersonData = (req, res, next) => {
  const { number, name } = req.body
  if(String(name).length <3){
    return res.status(400).json({
      error: 'name should be atleast 3 characters long.'
    })
  }
  if(!number){
    return res.status(400).json({
      error: 'number is missing'
    })
  }
  if(typeof(number) !== 'string'){
    return res.status(400).json({
      error: 'phone number should be a string'
    })
  }
  if(number.length < 8){
    return res.status(400).json({
      error: 'phone number must be atleast 8 characters'
    })
  }
  // If all checks pass, move on to the actual route handler
  next()
}

app.post('/api/persons', validatePersonData, (req,res, next) => {
  const { number, name } = req.body
  const person = new Person({
    name,
    number
  })
  person.save()
    .then(contact => res.status(200).json(contact))
    .catch(err => next(err))
})

// Ex 3.17
app.put('/api/persons/:id', validatePersonData, (req,res,next) => {
  const { name, number } = req.body
  const person ={ name, number }
  // Update directly using findByIdAndUpdate
  // { new: true } returns the updated document instead of the old one
  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators:true, context: 'query' })
    .then(updatedContact => {
      if(updatedContact){
        return res.status(200).json(updatedContact)
      }else{
        return res.status(404).json({ error: 'person not found' })
      }
    })
    .catch(err => next(err))
})

// incorrect url is redirected to homepage
app.get('/{*splat}', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'Malformatted id' })
  }
  if(error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Serer running on port ${PORT}`)
})