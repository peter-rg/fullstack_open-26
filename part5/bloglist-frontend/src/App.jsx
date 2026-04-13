import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/loginForm'
import BlogForm from './components/blogForm'
import blogService from './services/blogs'
import Notifications from './components/Notifications'
import Toggable from './components/Toggable'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser')
    if(loggedUser){
      const user  = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (text, success = true) => {
    setMessage({ text:text, success:success })
    setTimeout(() => setMessage(null), 4000)
  }
  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    console.log('userdb: ', localStorage.getItem('loggedUser'))
    setUser(null)
    notify('Logged out successfully')
  }
  const updateLikes = async(id) => {
    const blogToUpdate = blogs.find(b => b.id === id)
    if(!blogToUpdate) return
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    const likedBlog = await blogService.update(id, updatedBlog)
    setBlogs(prev => prev.map(b => b.id === updatedBlog.id ? likedBlog : b))
  }
  const deleteBlog = async(id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    const { title, author } = blogToDelete
    const confirmDelete = confirm(`Remove blog ${title} by ${author}`)
    if(!confirmDelete) return

    await blogService.deleteBlog(id)
    setBlogs(prev => prev.filter(b => b.id !== id))
  }

  const orderBlogsByLikes = blogs.toSorted((a,b) => b.likes - a.likes)
  return (
    <div className='blog-app'>
      <Notifications message={message}/>

      {user === null
        ? (
          <Toggable label='Login'>
            <LoginForm setUser={setUser}
              notify ={notify}
            />
          </Toggable>
        )
        : (
          <>
            <h1 style={{ color: 'green', display:'inline-block', marginRight: '5px' }}>
              {user.name}
            </h1>
            <button onClick={handleLogout}>Logout</button>
            <br />
            <Toggable label='create new blog' ref={blogFormRef}>
              <BlogForm
                user={user}
                blogFormRef={blogFormRef}
                setBlogs= {setBlogs}
                notify = {notify}
              />
            </Toggable>
          </>
        )
      }
      <h2>blogs</h2>
      <div className='blogs'>
        {
          orderBlogsByLikes.map(blog =>
            <Blog key={blog.id} blog={blog} user={user}
              updateLikes={updateLikes} deleteBlog={deleteBlog}
            />
          )
        }
      </div>
    </div>
  )
}

export default App