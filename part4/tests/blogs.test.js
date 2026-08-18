const {test, describe, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Blog = require('../models/blog.model')
const {initialBlogs, blogsInDb, nonExistingId} = require('./test_helper')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async() => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
  })

  test('all blogs are returned as json and have correct amount', async() => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)  
  })

  test('all blogs have id property', async() => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => blog.id)

    assert(ids.every(id => id !== undefined))
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async() => {
      const newBlog = {
        author: "James alni",
        title: "testing",
        url: "backend/testing",
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

      const authors = blogsAtEnd.map(b => b.author)
      assert(authors.includes(newBlog.author))
    })

    test('if likes property is missing, it defaults to zero', async() => {
      const newBlog = {
        author: "James alni",
        title: "testing",
        url: "backend/testing",
      }

      const res  = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      assert.strictEqual(res.body.likes,0)
    })


    test('if url or title is missing, it fails with status code 400', async() => {
      const blogWithoutUrl = {
        author: "jmes",
        title : 'system thinking',
      }
      const blogWithoutTitle = {
        url : "system/likes",
        author: 'jmes'
      }
      await api.post('/api/blogs').send(blogWithoutUrl).expect(400)
      await api.post('/api/blogs').send(blogWithoutTitle).expect(400)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status 204 if id is valid', async() => {
      const blogsAtStart= await blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
      const blogsAtEnd = await blogsInDb()
      const ids = blogsAtEnd.map(blog => blog.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length -1)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with valid id', async() => {
      const blogsAtStart = await blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      
      const updateData = {likes: 154}
      const resultBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateData).expect(200)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(resultBlog.body.likes, updateData.likes)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
      
    })
  })
})





after(async() => await mongoose.connection.close())