import { useState } from "react"

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [showAll, setShowAll] = useState(false)

  const blogStyles = {
    marginBottom: "5px",
    padding: "2px 5px",
    border: "2px solid"
  }
 
  const buttonLabel = () => (
    <button onClick={() => setShowAll(!showAll)}>
      {showAll ? "hide" : "view"}
    </button> 
  )


  const blogPreview = ()=> (
    <>
      {blog.title} {blog.author} {buttonLabel()}
    </>
  )

  const blogDetails = ()=>(
    <>
      <span>{blog.title}</span> {buttonLabel()}
      <p>{blog.url}</p>
      <span>likes: {blog.likes}</span>
      <button onClick={() => updateLikes(blog.id)}>like</button>
      <p>{blog.author}</p>
      {
        user.username === blog.user.username && 
          <button onClick={() => deleteBlog(blog.id)}>Delete</button>        
      }
    </>
  )

  return <div>   
    <div style={blogStyles}>
      {
        showAll 
          ? blogDetails()
          : blogPreview()
      }
  
    </div>
  </div>

}

export default Blog