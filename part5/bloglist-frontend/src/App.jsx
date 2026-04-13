import { useState, useEffect } from 'react'
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
    setMessage({text:text, success:success})
    setTimeout(() => setMessage(null), 4000)
  }
  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    console.log("userdb: ", localStorage.getItem('loggedUser'))
    setUser(null)
    notify("Logged out successfully")
  }

  return (
    <div>
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
              <h1 style={{color: "green", display:'inline-block', marginRight: "5px"}}>
                {user.name}
              </h1>
              <button onClick={handleLogout}>Logout</button>
              <br />
              <Toggable label='create new blog'>
                <BlogForm 
                  blogs={blogs}
                  setBlogs= {setBlogs} 
                  notify = {notify}
                />
              </Toggable>
            </>
          )
      }
      <h2>blogs</h2>
      {
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )
      }
    </div>
  )
}

export default App