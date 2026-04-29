const Header =(props)=>{
  return (<h1>{props.course}</h1>)}

const Total = ({parts}) => <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p> 

const Part = ({part, exercise}) => <p>{part} {exercise}</p>

const Content = ({parts})=>{
  return (
    <>
      <Part part={parts[0].name} exercise={parts[0].exercises}/>
      <Part part={parts[1].name} exercise={parts[1].exercises}/>
      <Part part={parts[2].name} exercise={parts[2].exercises}/>
    </>
  )
}

function App() {
      const course ={
      name: "Half stack application development",
      parts: [{
        name:"Fundamentals of react",
        exercises:10
      },
      {
        name:"Using props to pass data",
        exercises: 7
        
      },
      {
        name:"State of a component",
        exercises: 14
      }]
    }
   return(
    <>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </>
   )
}

export default App
