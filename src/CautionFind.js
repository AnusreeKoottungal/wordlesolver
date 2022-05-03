import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  let [words, setWords] = useState(null);
  useEffect(() => {
    fetch(
      "https://static.nytimes.com/newsgraphics/2022/01/25/wordle-solver/assets/solutions.txt"
    )
      .then((response) => response.text())
      .then((data) => {
       // setPossibleWords(data.split("\n"));
        setWords(data.split("\n"));
      });
  }, []);
 let cautionWords = 1;
  function calculateWordMatch() {
    if(!words || words.length === 0){
      return;
    }
    for (let l = 0; l < words.length; l++) {
      let correctPosLetters = [];
      let incorrectPosLetters = [];
      let invalidLetters = [];
      let lastIndex = 0;
      let destWord = words[l];

      const incorrectPosMap = new Map();
      const correctPosMap = new Map();

      let prevWord = "crane";
      let found = false;
      let findCount = 1;
      while (!found) {
        let prevResult = "";
        if(destWord === prevWord){
          found = true;
          break;
        }
        findCount++;
        for (let q = 0; q < 5; q++) {
          if (prevWord[q] ===destWord[q]) {
            prevResult+= "y";
          } else if (
            prevWord[q] !== words[l ][q] &&
           destWord.includes(prevWord[q])) {
            prevResult+= "x";
          } else {
            prevResult+= "n";
          }
        }

        prevWord = prevWord.toLowerCase();

        for (var i = 0; i < prevWord.length; i++) {
          let incorrect = incorrectPosMap.get(i);
          if (!incorrect) {
            incorrect = [];
          }
          if (prevResult[i] === "y") {
            correctPosLetters.push(prevWord[i]);
            correctPosLetters = [...new Set(correctPosLetters)];
            if (!correctPosMap.get(i)) {
              correctPosMap.set(i, prevWord[i]);
            }
            correctPosMap.set(i, prevWord[i]);
          } else if (prevResult[i] === "n") {
            invalidLetters.push(prevWord[i]);
            invalidLetters = [...new Set(invalidLetters)];
          } else {
            incorrectPosLetters.push(prevWord[i]);
            incorrectPosLetters = [...new Set(incorrectPosLetters)];
            incorrect.push(prevWord[i]);
            incorrect = [...new Set(incorrect)];
            incorrectPosMap.set(i, incorrect);
          }
          if (correctPosLetters.length === 5) {
            found = true;
           break;
          }
        }
        
        let posSolFound = false;
        for (let i = lastIndex; i < words.length; i++) {
          
          let isSolution = true;
          if(posSolFound) {
            break;
          }
          const word = words[i];

          for (let j = 0; j < word.length; j++) {
            //Not a solution if the word does not contain a letter previously found to be in correct position.
            if (
              (correctPosMap.get(j) && correctPosMap.get(j) !== word[j]) ||
              //Not a solution if the word contains an invalid letter.
              invalidLetters.includes(word[j]) ||
              //Not a solution if the word contains a letter in a position previously found to be incorrect.
              (incorrectPosMap.get(j) &&
                incorrectPosMap.get(j).join().includes(word[j]))
            ) {
              isSolution = false;
            }
          }
          if (isSolution) {
            for (let j = 0; j < incorrectPosLetters.length; j++) {
              if (!word.includes(incorrectPosLetters[j])) {
                isSolution = false;
              }
            }
          }
          if (isSolution) {
            posSolFound = true;
            prevWord = word;
            lastIndex = i+1;
            if (words[l] === word) {
              found = true;
              findCount ++;
              if(findCount > 6){
                console.log(cautionWords+'. Caution For '+ destWord+ '. Took '+ findCount+ 'tries');
                cautionWords++;
              }
              break;
            }
            
            //break;
          }
        }
        if (words[l] === prevWord) {
          found = true;
          break;
        }
      }
    }
  }

  return (
    
      <input
            id="calc"
            type="button"
            style={{
              width: "150px",
              height: "35px",
              marginLeft: "100px",
              marginRight: "100px",
              color: "white",
              background: "black",
              border: "1px solid white",
              fontWeight: "bold",
            }}
           onClick={calculateWordMatch}
            value="Show Next Guess"
          />
   
  );
}

export default App;
