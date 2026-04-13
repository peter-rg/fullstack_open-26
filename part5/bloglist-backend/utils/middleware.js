const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const logger = require('../utils/logger')
const { json } = require('express')

const errorHandler = (error,req,res,next) => {
  logger.error(error.message)
  if(error.name === 'ValidationError'){
    return res.status(400).json({error: error.message})
  }
  if(error.name === "CastError"){
    return res.status(400).json({error: "Malformatted Id"})
  }
  if(error.name === "MongoServerError" && error.code === 11000){
    return res.status(400).json({error: "Expected username to be unique"})
  }
  if(error.name === "JsonWebTokenError"){
    return res.status(401).json({error: "Invalid token"})
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if(authorization && authorization.startsWith('Bearer')){
    req.token = authorization.replace('Bearer ', '')
  }else{
    req.token = null
  }
  next()
}

const userExtractor = async(req, res, next) => {
  if(req.token){
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if(decodedToken.id){
      req.user = await User.findById(decodedToken.id)
    }
  }else{
    req.user = null
  }
  next()
}

const unknownEndpoint = (req,res) => {
  res.status(404).json({error: "Unknown Endpoint"})
}

module.exports = {errorHandler, tokenExtractor, userExtractor, unknownEndpoint}