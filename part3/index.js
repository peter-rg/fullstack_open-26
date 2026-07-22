const express = require("express")
const morgan = require('morgan')

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


// EX 3.1
app.get('/api/persons', (req,res)=>{
	res.json(contacts)
})
// EX 3.2
app.get('/info', (req,res)=>{
	res.send(`Phonebook has info for ${contacts.length} people <br/><br/> ${Date()}`)
})
// EX 3.3
app.get('/api/persons/:id', (req,res)=>{
	const id = req.params.id
	const contact = contacts.find(c=> c.id === id)

	if(!contact){
		return res.status(404).end()
	}

	res.json(contact)
})
// EX 3.4
app.delete('/api/persons/:id', (req,res)=>{
	const id = req.params.id
	const contact = contacts.find(c=> c.id === id)
	if(!contact){
		return res.status(400).json({
			error: "the contact does not exist"
		})
	}
	contacts = contacts.filter(c=> c.id !==id)
	res.status(204).end()
})
// EX 3.5
app.post('/api/persons', (req,res)=>{
	const contact = req.body
	// console.log("target", contact.name.toLowerCase())
	if(!contact || Object.keys(contact).length === 0){
		return res.status(400).json({
			error: "the body cannot be empty"
		})
	}
	const existingContact = contacts.find(c => c?.name?.toLowerCase() === contact?.name?.toLowerCase())
	console.log("exists", existingContact)
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

		
		if(existingContact){
			return res.status(400).json({
				error: "name must be unique"
			})
		}
		
	contact.id = String(Math.floor(Math.random()*30)+contacts.length)
	contacts = contacts.concat(contact)
	res.json(contact)
})



app.listen(3001, ()=>{
	console.log('Server running on port 3001')
})