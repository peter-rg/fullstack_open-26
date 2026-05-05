import Course from "./Course"

function App() {
      const courses =[
      {
      id:1,
      name: "Half stack application development",
      parts: [{
        id:1,
        name:"Fundamentals of react",
        exercises:10
      },
      {
        id:2,
        name:"Using props to pass data",
        exercises: 7
        
      },
      {
        id:3,
        name:"State of a component",
        exercises: 14
      },
      {
        id:4,
        name: "Redux",
        exercises: 11
      },
      
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    },
    {
      name: "Next Js",
      id:5,
      parts: [
        {
          name: "Static site generation",
          exercises: 2
        },
        {
          name: "page router",
          exercises: 11,
        }
      ]
    }
  ]
   return(
    <>
      <h1>Web development curriculum</h1>
      {courses.map((course, index)=> <Course key={index} course={course} />)}
    </>
   )
}

export default App
