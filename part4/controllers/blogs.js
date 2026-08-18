const blogsRouter = require('express').Router()
const Blog = require('../models/blog.model')

blogsRouter.get('/', async(req,res)=>{
  const blogs = await Blog.find({}) 
  res.status(200).json(blogs)
})
blogsRouter.get('/:id', async(req,res)=>{
  const blog = await Blog.findById(req.params.id)
  res.status(200).json(blog)
})

blogsRouter.post('/', async(req,res)=>{
  const blog = new Blog(req.body)

  const savedBlog = await blog.save()
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