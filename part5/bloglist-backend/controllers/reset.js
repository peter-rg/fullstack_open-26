const Blog = require('../models/blog.model')
const User = require('../models/user.model')

const resetRouter = require('express').Router()

resetRouter.post('/reset', async (req, res) => {
  console.log("RESET CALLED");

  const blogs = await Blog.deleteMany({});
  const users = await User.deleteMany({});

  console.log("Deleted blogs:", blogs.deletedCount);
  console.log("Deleted users:", users.deletedCount);

  res.status(204).end();
});

module.exports  = resetRouter