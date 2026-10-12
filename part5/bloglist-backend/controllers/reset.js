const Blog = require('../models/blog.model')
const User = require('../models/user.model')

const resetRouter = require('express').Router()

resetRouter.post('/reset', async (req, res) => {
  console.log("RESET CALLED");

  const blogs = await Blog.deleteMany({});
  const users = await User.deleteMany({});

  // console.log("Deleted blogs:", blogs.deletedCount);
  // console.log("Deleted users:", users.deletedCount);

  res.status(204).end();
});
resetRouter.post('/seed', async(req, res) => {
  const {blogs, username} = req.body
  const user = await User.findOne({username})
  const blogsWithUser = blogs.map(blog => ({...blog, user:user._id}))

  await Blog.insertMany(blogsWithUser)
  res.status(201).end()
})

module.exports  = resetRouter