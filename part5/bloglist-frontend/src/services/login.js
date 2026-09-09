import axios from 'axios'

const login = async(user) => {
  const response = await axios.post('/api/login', user)
  return response.data
}

export default login