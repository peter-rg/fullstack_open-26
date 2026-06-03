import React from 'react'

const Notification = ({message, color}) => {
    if (message===null){
        return null
    }
    const notificationStyle ={
    border: "5px solid",
    borderRadius: "10px",
    marginBottom: "5px",
    padding: "5px"
    }

    color === "green"? notificationStyle.color='green': notificationStyle.color ="red"

  return (
    <div style={notificationStyle}>
        {message}
    </div>
  )
}

export default Notification