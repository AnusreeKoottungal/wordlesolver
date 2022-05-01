import React from "react";
import { useNavigate } from 'react-router-dom';

function HowToUse() {
    const navigate = useNavigate();
  return <React.Fragment>
      <div style={{marginLeft: '20px', color: 'white'}}>
      <h1>How to Use Wordle Solver</h1>
      <p>First things first, I do not claim that this app will always give you the correct answer in 6 tries.
          
          But most of the time, it does. </p><p> For Example: If the word is SHAPE, this app does not solve it in 6 tries.
      </p>
      <p>I have used the <a href="https://static.nytimes.com/newsgraphics/2022/01/25/wordle-solver/assets/solutions.txt" >list of words shared by NYT</a> as my source</p>
      <p>As the NYT Wordlebot suggests, my starting guess is always CRANE</p>
      <h2>Steps</h2>
      <p>1. Enter the word as shown in the wordle solver in the Wordle App.</p>
      <p>2. Wordle will change the color of alphabet squares accordingly. In the wordle solver, mark each alphabet's color as per this. You can click on each letter to change color.</p>
      <p>3. Click on the 'Show Next Guess' button to reveal the next guess; Repeat</p>
      </div>
      <br/>
      <button onClick={() => navigate('/solve')}  style={{
                  width: "150px",
                  height: "35px",
                  margin: "10px",
                  color: "white",
                  background: "black",
                  border: "1px solid white",
                  fontWeight: "bold",
                }}>
      Solve Your Wordle
    </button>
    
  </React.Fragment>;
}
export default HowToUse;
