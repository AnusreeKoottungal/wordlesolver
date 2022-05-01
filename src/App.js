import "./App.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function App() {
  let [possibleWords, setPossibleWords] = useState(null);
  let prevWord = "crane";
  const navigate = useNavigate();
  useEffect(() => {
    fetch(
      "https://static.nytimes.com/newsgraphics/2022/01/25/wordle-solver/assets/solutions.txt"
    )
      .then((response) => response.text())
      .then((data) => {
        setPossibleWords(data.split("\n"));
      });
  }, []);

  var count = {
    button11: 1,
    button12: 1,
    button13: 1,
    button14: 1,
    button15: 1,
    button21: 1,
    button22: 1,
    button23: 1,
    button24: 1,
    button25: 1,
    button31: 1,
    button32: 1,
    button33: 1,
    button34: 1,
    button35: 1,
    button41: 1,
    button42: 1,
    button43: 1,
    button44: 1,
    button45: 1,
    button51: 1,
    button52: 1,
    button53: 1,
    button54: 1,
    button55: 1,
    button61: 1,
    button62: 1,
    button63: 1,
    button64: 1,
    button65: 1,
  };
  var guessCount = 1;
  function setColor(btn, color) {
    var property = document.getElementById(btn);
    if (property) {
      if (count[btn] === 0) {
        property.style.backgroundColor = "black";
        count[btn] = 1;
      } else if (count[btn] === 1) {
        property.style.backgroundColor = "yellow";
        count[btn] = 2;
      } else {
        property.style.backgroundColor = "green";
        count[btn] = 0;
      }
    }
  }
  let correctPosLetters = [];
  let incorrectPosLetters = [];
  let invalidLetters = [];
  let lastIndex = 0;

  const incorrectPosMap = new Map();
  const correctPosMap = new Map();

  setTimeout(() => {
    for (let i = 0; i < prevWord.length; i++) {
      const buttonEl = document.getElementById("button" + guessCount + (i + 1));
      if (buttonEl) {
        buttonEl.value = prevWord[i].toUpperCase();
      }
    }
  }, 10);

  function getNextWord() {
    let prevResult = "";
    for (let i = 0; i < 5; i++) {
      const buttonElement = document.getElementById(
        "button" + guessCount + (i + 1)
      );
      if (buttonElement) {
        const buttonBg = buttonElement?.style.backgroundColor;
        let res =
          buttonBg === "yellow"
            ? "x"
            : buttonBg === "black" || buttonBg === ""
            ? "n"
            : "y";
        prevResult = prevResult + res;
      }
    }
    prevWord = prevWord.toLowerCase();
    prevResult = prevResult.toLowerCase();

    for (var i = 0; i < prevWord.length; i++) {
      let incorrect = incorrectPosMap.get(i);
      if (!incorrect) {
        incorrect = [];
      }
      if (prevResult[i] === "y") {
        correctPosLetters.push(prevResult[i]);
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
        console.log(
          "Congratulations! The solution is " + prevWord.toUpperCase()
        );
        break;
      }
    }

    for (let i = lastIndex; i < possibleWords.length; i++) {
      const word = possibleWords[i];
      let isSolution = true;

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
          break;
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
        lastIndex = i + 1;
        prevWord = word;
        break;
      }
    }
    console.log("Please try " + prevWord + " as your next guess");
    ++guessCount;
    for (let k = 0; k < 5; k++) {
      let btn = document.getElementById("button" + guessCount + (k + 1));
      if (btn) {
        btn.style.background = "black";
        btn.value = prevWord[k].toUpperCase();
      }
      const guessDiv = document.getElementById("guess" + guessCount);
      if (guessDiv) {
        guessDiv.style.visibility = "visible";
      }
    }
  }

  return (
    <React.Fragment>
      <button onClick={() => navigate('/howto')} style={{
                  width: "150px",
                  height: "35px",
                  margin: "10px",
                  color: "white",
                  background: "black",
                  border: "1px solid white",
                  fontWeight: "bold",
                }}> How to Use</button>
    <div className="App" style={{ margin: "100px" }}>
              {[1, 2, 3, 4, 5].map((b) => {
                const visibility = b === 1 ? "visible" : "hidden";
                return (
                  <React.Fragment>
                    <div
                      id={"guess" + b}
                      className="guess"
                      key={"guess" + b}
                      style={{ visibility: visibility }}
                    >
                      {[1, 2, 3, 4, 5].map((a) => {
                        const buttonName = "button" + b + a;
                        return (
                          <input
                            type="button"
                            id={buttonName}
                            key={buttonName}
                            onClick={() => setColor(buttonName, "blue")}
                          />
                        );
                      })}
                      <br />
                      <br />
                    </div>
                  </React.Fragment>
                );
              })}
            <div style={{ width: "500px", alignItems: "center" }}>
              <input
                type="button"
                style={{
                  width: "150px",
                  height: "35px",
                  margin: "100px",
                  color: "white",
                  background: "black",
                  border: "1px solid white",
                  fontWeight: "bold",
                }}
                onClick={getNextWord}
                value="Show Next Guess"
              />
            </div>
    </div>
    </React.Fragment>
  );
}

export default App;
