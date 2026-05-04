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
    }
  ]
   return(
    <>
      <h1>Web development curriculum</h1>
      <Course course={courses[0]}/>
      <Course course= {courses[1]}/>
    </>
   )
}

export default App
