import React, { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({ setUser, notify }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginReset = () => {
    setUsername('')
    setPassword('')
  }
  const handleLogin = async(e) => {
    e.preventDefault()
    const user = {
      username,
      password
    }
    try {
      const loggedUser = await loginService(user)
      // console.log('first: ', loggedUser)
      localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      setUser(loggedUser)
      notify('logged successfully')
      loginReset()
    } catch (error) {
      notify(error.response?.data?.error, false)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="Username">Username: </label>
        <input type="text" value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm