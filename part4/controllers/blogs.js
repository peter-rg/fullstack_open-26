const blogsRouter = require('express').Router()
const Blog = require('../models/blog.model')

blogsRouter.get('/', (req,res, next)=>{
  Blog.find({}) 
    .then(blogs => res.status(200).json(blogs))
    .catch(err => next(err))
})

blogsRouter.post('/', (req,res, next)=>{
  const blog = new Blog(req.body)
  if(!blog){
    return res.status(400).json({error: 'provide the blog details'})
  }
  blog.save()
    .then(blog => res.status(201).json(blog))
    .catch(err => next(err))
})

module.exports = blogsRouter