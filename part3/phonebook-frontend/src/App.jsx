import React, { useEffect, useState } from 'react'
import phoneServices from "./services/phoneServices"
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newContact, setNewContact] =useState('')  
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState('green')
  
  const handleName =(e)=>setNewName(e.target.value)
  const handleContact =(e)=>setNewContact(e.target.value)
  const handleFilterName =(e)=>setFilterName(e.target.value)

  const showNotification = (text, type = "success") => {
    setMessage(text);
    setColor(type === "success" ? "green" : "red");
    
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };
  
  const removePerson =(id)=>{
    const name = persons.find(p=>p.id === id).name
    // console.log("name", name);
    const confirmDelete =window.confirm(`Delete ${name}?`) 
    if(confirmDelete){
       phoneServices
      .remove(id)
      .then(
        ()=>{
          setPersons(persons.filter(p=> p.id !==id))
          setMessage(`${name} deleted`)
          setColor("red")
          setTimeout(() =>setMessage(null), 5000)
        }
      )
    }    
  }
  const addPerson = async()=>{
    try {
      const createdContact = {
        name: newName,
        number: String(newContact)
      }
      const returnedContact = await phoneServices.create(createdContact)
      setPersons(prevpersons=>prevpersons.concat(returnedContact))
      showNotification(`${returnedContact.name} added`, 'success')
      // Clears form after successful POST
      formReset();
    }
    catch(err){
      const errorMessage = err.response?.data?.error || 'Network error or Server is down'
      showNotification(errorMessage, 'error')
    } 
  }
  const updatePerson = async(existingContant)=>{
  // Guard clause: Stop early if number is empty
    if (!newContact.trim()) {
      showNotification("Please provide a phone number", 'error')
      return
    }

    const updatedContact = { ...existingContant, number: newContact }
    const id = existingContant.id

    const confirmUpdate = window.confirm(
      `${existingContant.name} is already added to phonebook, replace the old number with a new one?`
    )
    if (!confirmUpdate) return

    try {
      const changedContact = await phoneServices.update(id, updatedContact)
      setPersons(prevPersons =>
        prevPersons.map(person => (person.id === id ? changedContact : person))
      )
      showNotification(`${changedContact.name}'s number updated successfully`, 'success')
      formReset()
    } catch (err) {
      // Check the specific HTTP status code
      if (err.response?.status === 400) {
        // Show backend validation error (e.g., "number is missing")
        showNotification(err.response.data.error, 'error')
      } else if (err.response?.status === 404) {
        // Contact was actually deleted by another user
        showNotification(`${existingContant.name} was already deleted from the server`, 'error')
        setPersons(prevPersons => prevPersons.filter(p => p.id !== id))
      } else {
        showNotification("An unexpected error occurred", 'error')
      }
    }
  }

  const formReset =()=>{
    setNewName('')
    setNewContact('')
  }

  const addContact =async(e)=>{
    e.preventDefault()
    const existingContant = persons.find(person =>person.name?.toLowerCase() === newName.toLowerCase())

    // Creating  new database entry of new contact/person
    if (!existingContant){
      addPerson()
    }
    // updating the person number when name already exists in database
    else {
      updatePerson(existingContant)
    }
  }
  
  const passedProps= {
    newName,
    newContact,
    filterName,
    handleName,
    handleContact,
    handleFilterName,
    removePerson
  }

  useEffect(()=>{
    phoneServices
      .getAll()
      .then(persons=> setPersons(persons))
      .catch(err => err.response?.data?.message)
  },[])

  // console.log("App passedProps:", passedProps);
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} color={color}/>
      <Filter passedProps={passedProps}/>
      <PersonForm passedProps={passedProps} addContact={addContact}/>
      <h2>Numbers</h2>
      <Persons persons={persons} passedProps={passedProps}/>  
    </div>
  )
}

export default App
