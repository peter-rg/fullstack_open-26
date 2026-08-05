const express = require("express")
const morgan = require('morgan')
const Person = require('./models/contacts')

let contacts = [
	{ 
			"id": "1",
			"name": "Arto Hellas", 
			"number": "040-123456"
	},
	{ 
			"id": "2",
			"name": "Ada Lovelace", 
			"number": "39-44-5323523"
	},
	{ 
			"id": "3",
			"name": "Dan Abramov", 
			"number": "12-43-234345"
	},
	{ 
			"id": "4",
			"name": "Mary Poppendieck", 
			"number": "39-23-6423122"
	} 
]
const app = express()
app.use(express.json())

// Ex 3.8
morgan.token("post", (req)=> (
	req.method ==="POST"? JSON.stringify(req.body)|| ' ' : " "
))
//formated string format for morgan
const tinyWithBody = ':method :url :status :res[content-length] -:response-time ms :post'

// EX 3.7
app.use(morgan(tinyWithBody))

app.use(express.static('dist'))

// EX 3.1
app.get('/api/persons', (req,res, next)=>{
	// EX 3.13
	Person.find({})
		.then(contacts => res.status(200).json(contacts))
		.catch(err=> next(err))
})
app.get('/info', (req,res, next)=>{
	Person.countDocuments({})
		.then(count=>{
			res.status(200).send(`Phonebook has info for ${count} people <br/><br/> ${Date()}`)
		})
		.catch(err => next(err))
})
app.get('/api/persons/:id', (req,res, next)=>{
	Person.findById(req.params.id)
		.then(contact=>{
			if(!contact){
				return res.status(404).end()
			}
			res.status(200).json(contact)
		})
		.catch(error => next(error))
})
// EX 3.4
app.delete('/api/persons/:id', (req,res, next)=>{
	Person.findByIdAndDelete(req.params.id)
		.then(result => res.status(204).end())
		.catch(err=> next(err))
})
// EX 3.5
app.post('/api/persons', (req,res, next)=>{
	const contact = req.body

	if(!contact || Object.keys(contact).length === 0){
		return res.status(400).json({
			error: "the body cannot be empty"
		})
	}
	// const existingContact = contacts.find(c => c?.name?.toLowerCase() === contact?.name?.toLowerCase())
	// console.log("exists", existingContact)
	// EX 3.6
		if(!contact.name){
			return res.status(400).json({
				error: "name is missing"
			})
		}
		if(!contact.number){
		
			return res.status(400).json({
				error: "number is missing"
			})
		}
		if(!/^\+?\d+(?:[ -]?\d+)*$/.test(contact.number)){
			return res.status(400).json({
				error: "invalid phone number format"
			})
		}

		
		// if(existingContact){
		// 	return res.status(400).json({
		// 		error: "name must be unique"
		// 	})
		// }

		// When all requirements are met create the contact/person
	const person = new Person({
		name: contact.name,
		number: contact.number
	})
	person.save()
		.then(contact=> res.status(200).json(contact))
		.catch(err => next(err))
})

// Ex 3.17
app.put('/api/persons/:id', (req,res,next)=>{
	const {name, number} = req.body
	if(!number){
		return res.status(400).json({error: "number is missing"})
	}
	const person ={name, number}
	// Update directly using findByIdAndUpdate
  // { new: true } returns the updated document instead of the old one
	Person.findByIdAndUpdate(req.params.id, person, {new: true})
		.then(updatedContact=>{
			if(updatedContact){
				return res.status(200).json(updatedContact)
			}else{
				return res.status(404).json({error: "person not found"})
			}
		})
		.catch(err=> next(err))
})

// incorrect url is redirected to homepage
app.get('/{*splat}', (req,res)=>{
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})
const errorHandler = (error, req, res, next)=>{
	console.error(error.message)
	if(error.name === "CastError"){
		return res.status(400).send({error: "Malformatted id"})
	}
	next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
	console.log(`Serer running on port ${PORT}`)
})