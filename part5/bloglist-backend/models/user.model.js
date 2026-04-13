const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    minlength: [3, "should have atleast 3 characters"],
    required: true,
    unique: true
  },
  passwordHash: String,
  blogs: [{
    type: Schema.Types.ObjectId,
    ref: "Blog"
  }]
})

userSchema.set('toJSON', {
  'transform' : (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
  }
})

const User = model('User', userSchema)

module.exports = User