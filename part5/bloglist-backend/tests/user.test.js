const mongoose = require('mongoose')
const {beforeEach, describe, test, after} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const User = require('../models/user.model')
const app = require('../app')

const api = supertest(app)

const usersInDb = async() => {
  const response = await api.get('/api/users')
  return response.body
}

beforeEach(async() => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('admin123', 9)
  const user = new User({
    name: "root",
    username: "adm",
    passwordHash
  })
  await user.save()
})

describe("Adding a new user", () => {
  test('succeeds with valid data', async() => {
    const userAtStart = await usersInDb()

    const validUser = {
      name: "jackline",
      username: "line",
      password: "line2678"
    }
    const savedUser = await api.post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await usersInDb()
    const usernames = userAtEnd.map(u =>u.username)
    assert(usernames.includes(validUser.username))

    assert.strictEqual(userAtStart.length, userAtEnd.length -1)
  })

  test('fails if username is missing', async() => {
    const userAtStart = await usersInDb()

    const userWithoutUsername = {
      name: "james",
      password: "ueywh109"
    }

    const result = await api.post('/api/users')
      .send(userWithoutUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes("Path `username` is required"))
    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('fails if username already exists', async() => {
    const userAtStart = await usersInDb()

    const duplicateUser= {
      name: "irene",
      username: "adm",
      password: "iren321"
    }
    const result = await api.post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    assert(result.body.error.includes("Expected username to be unique"))
    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('fails if username is small', async() => {
    const userAtStart = await usersInDb()

    const userWithSmallUsername = {
    name: "paul kimani",
    username: "kj",
    password: "jame21345"
    }
    const result = await api.post('/api/users')
      .send(userWithSmallUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes("should have atleast 3 characters"))
    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })
  
  test('fails when password is missing', async() => {
    const userAtStart = await usersInDb()
    const userWithoutPassword = {
      name: "jack",
      username: "jak"
    }

    const result = await api.post('/api/users')
      .send(userWithoutPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes("Password should not be missing or be less than 3 characters long"))
    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('fails when password is small', async() => {
    const userAtStart = await usersInDb()
    const userWithSmallPassword = {
      name: "jacob",
      username: "martin",
      password : '12'
    }
    const result = await api.post('/api/users')
      .send(userWithSmallPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes("Password should not be missing or be less than 3 characters long"))
    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })  
})

after(async() => await mongoose.connection.close())
