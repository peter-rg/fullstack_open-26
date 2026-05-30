import React, { useEffect, useState } from 'react'
import phoneServices from "./services/phoneServices"

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newContact, setNewContact] =useState('')  
  const [filterName, setFilterName] = useState('')

  const handleName =(e)=>setNewName(e.target.value)
  const handleContact =(e)=>setNewContact(e.target.value)
  const handleFilterName =(e)=>setFilterName(e.target.value)
  
  const removePerson =(id)=>{
    const name = persons.find(p=>p.id === id).name
    // console.log("name", name);
    
    window.confirm(`Delete ${name}?`) && phoneServices
      .remove(id)
      .then(()=>setPersons(persons.filter(p=> p.id !==id)))
  }

  const formReset =()=>{
    setNewName('')
    setNewContact('')
  }
  const addContact =(e)=>{
    e.preventDefault()
    const existingContant = persons.find(person =>person.name === newName)

    if (!existingContant){
      const createdContact = {
        name: newName,
        contact: newContact
      }
      phoneServices
        .create(createdContact)
        .then(returnedContact =>{
          setPersons(prevpersons=>prevpersons.concat(returnedContact)),
          formReset()
        })
    }else{
      const updatedContact = {...existingContant, contact:newContact}
      const id = existingContant.id
      const confirmUpdate = window.confirm(
        `${existingContant.name} already exists. replace the old number with new one`
      ) 
      if(confirmUpdate){
        phoneServices
        .update(id, updatedContact)
        .then(changedContact => {
          setPersons(prevpersons =>prevpersons.map(person=>{
            return person.id === id? changedContact : person 
          }),
          formReset()
        )})
      }
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
  },[])
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
  const {filterName, handleFilterName} = passedProps
  
  return (
    <div>
      filter shown with: 
      <input onChange={handleFilterName} value={filterName} />
    </div>
  )
}

const Persons =({passedProps, persons})=>{
  const {filterName,removePerson} =passedProps
  const contactsToshow = persons.filter(person=> new RegExp(filterName, "i").test(person.name))

  return (
    <div>
      {
      contactsToshow.map((person)=>{
        return(
            <li key={person.id}>
              <p>{person.name} {person.contact}</p>
              <button onClick={()=>removePerson(person.id)}>Delete</button>
            </li>
        )}
      )
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