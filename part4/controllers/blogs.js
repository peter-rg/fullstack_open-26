const blogsRouter = require('express').Router()
const Blog = require('../models/blog.model')
const User = require('../models/user.model')

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

  const users = await User.find({})
  if (users.length === 0) {
    return res.status(400).json({ error: "No users exist to assign to this blog" })
  }
  const index = Math.floor(Math.random()*users.length)
  const selectedUser = users[index]
  const userId = selectedUser._id

  const blog = new Blog({
    title, 
    author,
    url,
    likes,
    user: userId
  })

  const savedBlog = await blog.save()
  selectedUser.blogs = selectedUser.blogs.concat(savedBlog._id)
  await selectedUser.save() 
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