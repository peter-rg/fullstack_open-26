const Course = ({course})=>{
  return(
    <>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </>
  )
}
export default Course

const Header =(props)=>{
  return (<h2>{props.course}</h2>)}

const Total = ({parts}) => {
//   console.log("partstotal", parts[0].name);
//   console.log("len", parts.length)
  
  // let total =0
  // for (let i=0; i<parts.length; i++){
  //   total+=parts[i].exercises
  // }

  // parts.map((__,index )=> total +=parts[index].exercises)
  
  let total = parts.reduce((value, sum) => value+sum.exercises, 0)
//   console.log("sum", total)

  return (
    <h4>total of {total} exercises</h4>
  )
}

const Part = ({part}) =>{ 
  return(
    <p>{part.name} {part.exercises}</p>
  )
}
const Content = ({parts})=>{
  // console.log("parts", parts)
  return (
    <>
      {parts.map((part, index)=><Part key = {index} part={part}/>)}
    </>
  )
}