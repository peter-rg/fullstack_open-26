import { useState } from "react"

const Blog = ({ blog }) => {
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
      <button >like</button>
      <p>{blog.author}</p>
    </>
  )
  return <div>   
    <div style={blogStyles}>
      {
        showAll 
          ? blogDetails()
          : blogPreview()
      }
    {/* <button onClick={() => setShowAll(!showAll)}>
      {showAll ? "hide" : "view"}
    </button>  */}
    </div>
  </div>

}

export default Blog