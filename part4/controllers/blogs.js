const blogsRouter = require('express').Router()
const {userExtractor} = require('../utils/middleware')
const Blog = require('../models/blog.model')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(req,res)=>{
  const blogs = await Blog.find({}).populate("user", {blogs: 0}) 
  res.status(200).json(blogs)
})
blogsRouter.get('/:id', async(req,res)=>{
  const blog = await Blog.findById(req.params.id)
  if(!blog){
    return res.status(404).json({error: 'Blog not found'})
  }
  res.status(200).json(blog)
})

blogsRouter.post('/', userExtractor, async(req,res)=>{
  const {title, author, url, likes} = req.body

  if (!req.user) {
    return res.status(404).json({ error: "user not found" })
  }

  const blog = new Blog({
    title, 
    author,
    url,
    likes,
    user: req.user._id
  })

  const savedBlog = await blog.save()
  req.user.blogs = req.user.blogs.concat(savedBlog._id)
  await req.user.save() 
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async(req,res) => {
  if(!req.user){
    return res.status(401).json({error: 'token missing or invalid'})
  }
  const blog = await Blog.findById(req.params.id)
  if(!blog){
    return res.status(404).json({error: 'blog not found'})
  }
  if(req.user.id === blog.user.toString()){
    req.user.blogs.pull(blog._id) //remove the blog reference in the array
    await req.user.save() //save user to reflect changes in blogs field
    await blog.deleteOne()
    return res.status(204).end()
  }
  else{
    return res.status(401).json({error: "only the creator can delete this blog"})
  }
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