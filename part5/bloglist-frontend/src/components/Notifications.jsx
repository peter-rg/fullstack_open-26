import React from 'react'

const Notifications = ({message}) => {
  if(!message){
    return null
  }

  const noteficationStyle = {
    border: "2px solid",
    borderRadius: "3px",
    padding: '5px',
    marginBottom: "5px"
  }
  message.success
    ? noteficationStyle.color = 'green'
    : noteficationStyle.color = 'red'
  return (
    <div style={noteficationStyle}>{message.text}</div>
  )
}

export default Notifications