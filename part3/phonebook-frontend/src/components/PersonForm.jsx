import React from 'react'

function PersonForm({passedProps, addContact}) {
 const {newName, newContact, handleName, handleContact}=passedProps
//  console.log('name', newName);
 
 
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

export default PersonForm