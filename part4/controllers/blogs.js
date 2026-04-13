const blogsRouter = require('express').Router()
const Blog = require('../models/blog.model')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(req,res)=>{
  const blogs = await Blog.find({}).populate("user", {blogs: 0}) 
  res.status(200).json(blogs)
})
blogsRouter.get('/:id', async(req,res)=>{
  const blog = await Blog.findById(req.params.id)
  res.status(200).json(blog)
})

blogsRouter.post('/', async(req,res)=>{
  const {title, author, url, likes} = req.body
  // extract token from header
  const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer')){
      return authorization.replace('Bearer ', '')
    }
    return null
  }
  // check validity of token 
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken.id){
    res.status(401).json({error: 'Missing or invalid token'})
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(404).json({ error: "user not found" })
  }

  const blog = new Blog({
    title, 
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save() 
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async(req,res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async(req,res) => {
  const {likes} = req.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {likes},
    {new: true}
  )

  if(!updatedBlog){
    return res.status(404).json({error: 'blog not found'})
  }
  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter