const Blog = require('../models/blog.model')

const initialBlogs = [
  {
    "author": "James Khut",
    "title": "Art of computer Programming",
    "url": "computers/functionality",
    "likes": 72
  },
  {
    "author": "Dennis Ritchie",
    "title": "Procedural concepts",
    "url": "languages/generation",
    "likes": 12
  },
  {
    author: "Paul",
    title: "contryies gdp",
    url: 'africa/regions'
  }
]

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async() => {
  const blog = new Blog({
    author: "peter",
    title: "supertest",
    url: 'part4'
  })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

module.exports = { initialBlogs, blogsInDb, nonExistingId }