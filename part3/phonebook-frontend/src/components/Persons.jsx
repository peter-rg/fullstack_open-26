import React from 'react'

function Persons({passedProps, persons}) {
  const {filterName,removePerson} =passedProps
    const contactsToshow = persons.filter(person=> new RegExp(filterName, "i").test(person.name))
  
    return (
      <div>
        {
        contactsToshow.map((person)=>{
          return(
              <li key={person.id}>
                <p>{person.name} {person.number}</p>
                <button onClick={()=>removePerson(person.id)}>Delete</button>
              </li>
          )}
        )
        }
        {contactsToshow.length ===0 && <p>There is no name with the string <strong>{filterName}</strong></p>}
      </div>
    )
}

export default Persons