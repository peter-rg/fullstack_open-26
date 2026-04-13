import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}
const getAll = async() => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async(newBlog) => {
  const response = await axios.post(
    baseUrl,
    newBlog,
    { headers : { 'Authorization': token } }
  )
  return response.data
}

const update = async(id, blogUpdate) => {
  const response = await axios.put(`${baseUrl}/${id}`, blogUpdate)
  return response.data
}

const deleteBlog = async(id) => {
  await axios
    .delete(`${baseUrl}/${id}`, { headers : { 'Authorization': token } })
}
export default { getAll, create, update, deleteBlog, setToken }