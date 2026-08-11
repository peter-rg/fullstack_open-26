const express= require('express')
require('dotenv').config()
const mongoose = require('mongoose')

const app = express()

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(()=> console.log('connected to mongodb'))
  .catch((err) => console.log('connection failed', err))

const blogSchema = mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Author is essential']
  },
  title: {
    type: String,
    required: [true, 'Title is important']
  },
  url: {
    type: String,
    required: true
  },
  likes: Number
})

const Blog = mongoose.model('blog', blogSchema)

app.use(express.json())
app.get('/', (req,res)=>{
  res.status(200).send("Hello, enjoy the blogs")
})
app.get('/api/blogs', (req,res)=>{
  Blog.find({})
    .then(blogs => res.status(200).json(blogs))
    .catch(err => res.status(500).json({error: "An error occured"}))
})

app.post('/api/blogs', (req,res)=>{
  const blog = new Blog(req.body)
  if(!blog){
    return res.status(400).json({error: 'provide the blog details'})
  }

  blog.save()
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json({error: err.message}))
})

const port = process.env.PORT
app.listen(port, ()=>console.log(`Server running on port ${port}`))