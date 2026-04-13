import React, { useState } from 'react'

function BlogForm({ createBlog }) {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })


  const blogReset= () => setNewBlog({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = async(e) => {
    e.preventDefault()
    const blog = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }
    const success = await createBlog(blog)
    if(success) blogReset()
  }

  return (
    <div>
      <h2>Add a new Blog</h2>
      <form onSubmit={addBlog}>
        <label>
          Title
          <input type="text" value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          />
        </label>
        <br />
        <label>
          Author
          <input type="text" value={newBlog.author}
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
          />
        </label>
        <br />
        <label>
          Url
          <input type="text" value={newBlog.url}
            onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })}
          />
        </label>
        <br />
        <button>Save</button>
      </form>
    </div>
  )
}

export default BlogForm