const logger = require('../utils/logger')

const errorHandler = (error,req,res,next) => {
  logger.error(error.message)
  if(error.name === 'ValidationError'){
    return res.status(400).json({error: error.message})
  }
  if(error.name === "CastError"){
    return res.status(400).json({error: "Malformatted Id"})
  }

  next(error)
}

const unknownEndpoint = (req,res) => {
  res.status(404).json({error: "Unknown Endpoint"})
}

module.exports = {errorHandler, unknownEndpoint}