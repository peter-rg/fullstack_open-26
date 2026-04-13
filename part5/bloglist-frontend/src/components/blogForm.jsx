import React, { useState } from 'react'
import blogService from '../services/blogs'

function BlogForm({setBlogs, blogFormRef, notify}) {
   const [newBlog, setNewBlog] = useState({
      title: '',
      author: '',
      url: ''
    })

  
  const blogReset= () => {
    newBlog.title = '',
    newBlog.author = '',
    newBlog.url = ''
  }

  const addBlog = async(e) => {
    e.preventDefault()
    const blog = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    try {
      blogFormRef.current.toggleVisibility()
      const savedBlog = await blogService.create(blog)
      setBlogs(prevBlogs => prevBlogs.concat(savedBlog))
      notify('blog saved')
      blogReset()
    } catch (error) {
      notify(error.response?.data?.error, false)
    }
  }
  
  return (
    <div>
      <h2>Add a new Blog</h2>
      <form onSubmit={addBlog}>
        Title: 
        <input type="text" value={newBlog.title} 
          onChange={(e) => setNewBlog({...newBlog, title: e.target.value})} 
        /><br />
        Author: 
        <input type="text" value={newBlog.author} 
          onChange={(e)=> setNewBlog({...newBlog, author: e.target.value})}
        /> <br />
        Url: 
        <input type="text" value={newBlog.url} 
          onChange={(e) => setNewBlog({...newBlog, url: e.target.value})} 
        /> <br />
        <button>Save</button>
      </form>
    </div>
  )
}

export default BlogForm