const {test, describe, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog.model')
const User = require('../models/user.model')
const {initialBlogs, blogsInDb, nonExistingId} = require('./test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let token 
  beforeEach(async() => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    //create user for testing
    const passwordHash = await bcrypt.hash('admion123', 10)
    const user = new User({
      name: 'root',
      username: "superUser",
      passwordHash
    })
    const savedUser = await user.save()

     // login to gain a token
    const loginResponse = await api.post('/api/login')
      .send({username: savedUser.username, password: "admion123"})
      .expect(200)
    token = loginResponse.body.token

    // add userId to blogs and save
    const blogsArray = initialBlogs.map(blog => {
      return  new Blog(
          {...blog, user: savedUser._id}
        ).save()
      }
    )
    const savedBlogs = await Promise.all(blogsArray)
    savedUser.blogs = savedBlogs.map(b => b._id)
    await savedUser.save()
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
    test('succeeds with valid data and token', async() => {
      const newBlog = {
        title: "Testing with token",
        author: "Test Author",
        url: "http://test.com",
        likes: 2
      }

      const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert(result.body.user) //test if a user is appended 
      console.log("user", result.body.user)
      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

      const authors = blogsAtEnd.map(b => b.author)
      assert(authors.includes(newBlog.author))
    })

    test('fails with status 401 if token is missing', async() => {
      const newBlog = {
        title: 'Testing without token',
        author: "Anonymous",
        url: 'https//test.com'
      }
      await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)
      
      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })

    test('if likes property is missing, it defaults to zero', async() => {
      const newBlog = {
        author: "James alni",
        title: "testing",
        url: "backend/testing",
      }

      const res  = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400)
      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutTitle)
        .expect(400)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status 204 with valid id and token', async() => {
      const blogsAtStart= await blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
      const blogsAtEnd = await blogsInDb()
      const ids = blogsAtEnd.map(blog => blog.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length -1)
    })

    test('fails with status 401 if token is missing', async() => {
      const blogs = await blogsInDb()
      const blogToDelete = blogs[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
      
      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogs.length)
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