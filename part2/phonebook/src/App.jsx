import React, { useState } from 'react'

function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', contact: '040-123456', id: 1 },
    { name: 'Ada Lovelace', contact: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', contact: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', contact: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newContact, setNewContact] =useState('')  
  const [filterName, setFilterName] = useState('')

  const handleName =(e)=>setNewName(e.target.value)
  const handleContact =(e)=>setNewContact(e.target.value)
  const handleFilterName =(e)=>setFilterName(e.target.value)
  
  const addContact =(e)=>{
    e.preventDefault()
    const present = persons.findIndex(person =>person.name === newName )
    if (present < 0){
      setPersons(persons.concat({name: newName, contact: newContact}))
    }else{
    alert(`${newName} is already added in phonebook`)
    }

    // console.log("name", newName)
    setNewName('')
    console.log("contact", newContact);
    setNewContact('')
    console.log();
    
  }
    const passedProps= {
    newName,
    newContact,
    filterName,
    handleName,
    handleContact,
    handleFilterName
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter passedProps={passedProps}/>
      <PersonForm passedProps={passedProps} addContact={addContact}/>
      <h2>Numbers</h2>
      <Persons persons={persons} passedProps={passedProps}/>  
    </div>
  )
}

export default App

const Filter =({passedProps})=>{
  // console.log("props", props);
  const filterName =passedProps.filterName
  const handleFilterName = passedProps.handleFilterName
  
  return (
    <div>
      filter shown with: 
      <input onChange={handleFilterName} value={filterName} />
    </div>
  )
}

const Persons =({passedProps, persons})=>{
  const filterName = passedProps.filterName
  const contactsToshow = persons.filter(person=> new RegExp(filterName, "i").test(person.name))

  return (
    <div>
      {
      contactsToshow.map((person,index)=><p key={index}>{person.name} {person.contact}</p>)
      }
      {contactsToshow.length ===0 && <p>There is no name with the string <strong>{filterName}</strong></p>}
    </div>
  )
}

const PersonForm =({passedProps, addContact})=>{
  const {newName, newContact, handleName, handleContact}=passedProps

  return (
    <form onSubmit={addContact}>
    <div style={{margin: "5px"}}>
      Name: <input  onChange={handleName}
      value={newName} placeholder='new name'/>
    </div>
    <div>
      Contact: <input onChange={handleContact} placeholder="new contact" value={newContact}/>
    </div>
    <button type="submit">Add</button>
  </form>
  )
}