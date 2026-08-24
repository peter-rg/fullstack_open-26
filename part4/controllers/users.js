const userRouter = require('express').Router()
const User = require('../models/user.model')
const bcrypt = require('bcrypt')

userRouter.get('/', async(req,res) => {
  const users = await User.find({}).populate('blogs', {title: 1, url: 1})
  res.status(200).json(users)
})

userRouter.post('/', async(req,res) => {
  const {name, username, password} = req.body

  if(password ===undefined || password.toString().length < 3){
    return res.status(400).json({error: "Password should not be missing or be less than 3 characters long"})
  }

  const passwordHash = await bcrypt.hash(password.toString(), 10)
  // console.log("hash", passwordHash)

  const user = new User({name, username, passwordHash})
  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = userRouter