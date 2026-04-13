const dummy = (blogs) => {
  return 1
}

const totalLikes = (bloglist) => {
  return bloglist.reduce((total, current) => (total+current.likes), 0)
}

const favouriteBlog = (bloglist) => {
  if(bloglist.length === 0) return 0
  return bloglist.reduce((prev, current) => prev.likes > current.likes ? prev : current)
}
module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}