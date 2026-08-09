import React from 'react'

function Filter({passedProps}) {
  const {filterName, handleFilterName} = passedProps
  //  console.log("filter:", filterName);
   
   return (
     <div>
       filter shown with: 
       <input onChange={handleFilterName} value={filterName} />
     </div>
   )
}

export default Filter