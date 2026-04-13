import React, { useImperativeHandle, useState } from 'react'

const Toggable = (props) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = {display: visible ? 'none' : ''}
  const showWhenInvisible = {display: visible ? '' : 'none'}

  const toggleVisibility = () => setVisible(!visible)
  useImperativeHandle(props.ref, () => ({toggleVisibility}))
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.label}</button>
      </div>
      <div style={showWhenInvisible}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  
  )
}

export default Toggable