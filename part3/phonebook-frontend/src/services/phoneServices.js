import axios from "axios"

const baseUrl = "/api/persons"
const create = async(newObject)=>{
    const res = await axios.post(baseUrl, newObject)
    return res.data
}
const remove = async(id)=>{
    const res = await axios.delete(`${baseUrl}/${id}`)
}
const update = async(id,newObject)=>{
    const res = await axios.put(`${baseUrl}/${id}`, newObject)
    return res.data
}

const getAll = async()=>{
    const res = await axios.get(baseUrl)
    return res.data
}
export default {create, remove,update, getAll}