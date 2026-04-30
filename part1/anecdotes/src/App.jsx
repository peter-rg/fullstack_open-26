import { useState } from 'react'

const App = () => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(9).fill(0))

  // console.log(votes)
  // const vote5 =votes[5]=3
  // console.log("vote5", vote5)
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const handleVote = ()=>{
    console.log("votes:", votes[selected])
    
    const copyVotes = [...votes]
    // console.log("copy", copyVotes)
    copyVotes[selected] +=1
    // console.log("copy2", copyVotes)
    setVotes(copyVotes)
  }

  const randomAnecdote = ()=>{
    const index = Math.floor(Math.random()*anecdotes.length)
    setSelected(index)
    // console.log("selected", index)
  }
  const mostVotes =()=>{
    const copyVotes = [...votes]
    // sort in descending order 
    copyVotes.sort((a,b)=> b-a)
    const highestVote = copyVotes[0]
    const choice = votes.findIndex(vote =>vote === highestVote)

    return <div>
      {anecdotes[choice]} <br /> has {highestVote} votes
    </div>
  }
 
  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]} <br />
      {selected} has {votes[selected]} votes <br />
      <button onClick={handleVote}>vote</button>
      <button onClick={randomAnecdote}>nextanecdote</button>
      <h2>Anecdote with most votes</h2>
      {mostVotes()}
    </div>
  )
}

export default App

