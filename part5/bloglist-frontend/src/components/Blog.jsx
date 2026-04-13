import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [showAll, setShowAll] = useState(false)

  const buttonLabel = () => (
    <button onClick={() => setShowAll(!showAll)}>
      {showAll ? 'hide' : 'view'}
    </button>
  )


  const blogPreview = () => (
    <>
      {blog.title} {blog.author} {buttonLabel()}
    </>
  )

  const blogDetails = () => (
    <>
      <span>{blog.title}</span> {buttonLabel()}
      <br />
      <a href={blog.url}>{blog.url}</a>
      <br />
      <span>likes: {blog.likes}</span>
      <button onClick={() => updateLikes(blog.id)}>like</button>
      <p>{blog.author}</p>
      {
        user?.username === blog.user.username &&
          <button onClick={() => deleteBlog(blog.id)}>Delete</button>
      }
    </>
  )

  return <div className='blog'>
    {
      showAll
        ? blogDetails()
        : blogPreview()
    }

  </div>

}

export default Blog