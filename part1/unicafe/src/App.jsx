import { useState } from "react"

const App = ()=>{
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const goodFeedback =()=>{
    setGood(good+1)
  }
  const neutralFeedback =()=>{
    setNeutral(neutral+1)
  }
  const badFeedback = ()=>setBad(bad+1)
  const feedback = [good,neutral, bad]
  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={goodFeedback} text="good" />
      <Button onClick={neutralFeedback} text="neutral" />
      <Button onClick={badFeedback} text="bad" />
      <Statistics feedback={feedback}/>
    </div>
  )
}
export default App

const StatisticLine = ({text, value})=>{
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    
  )
}
const Button = ({onClick,text})=><button onClick={onClick}>{text}</button>

const Statistics = ({feedback})=>{
  const [good, neutral, bad] = feedback
  const all = good+neutral+bad 
  const average = (good-bad)/all 
  const positive = (good/all)*100

  if (good===0 && neutral ===0 && bad===0){
    return(
      <p>No feedback given</p>
    )
  }
  return(
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </>
  )

}