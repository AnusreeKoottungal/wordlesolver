import "./App.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    let found = false;
    let allPosibilities = [];
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
        correctPosLetters.push(prevWord[i]);
        correctPosLetters = [...new Set(correctPosLetters)];
        if (!correctPosMap.get(i)) {
          correctPosMap.set(i, prevWord[i]);
        }
        correctPosMap.set(i, prevWord[i]);
      } else if (prevResult[i] === "n") {
        if (
          !correctPosLetters.includes(prevWord[i]) &&
          !incorrectPosLetters.includes(prevWord[i])
        ) {
          invalidLetters.push(prevWord[i]);
          invalidLetters = [...new Set(invalidLetters)];
        } else{
          prevResult = prevResult.substring(0, i) + 'x' + prevResult.substring(i + 1);
        }
      } 
      if (prevResult[i] === "x") {
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
      if (isSolution && !found) {
        lastIndex = i + 1;
        prevWord = word;
        allPosibilities.push(word);
        found = true;
        //break;
      } else if (isSolution && found) {
        allPosibilities.push(word);
      }
    }
    console.log("Please try " + prevWord + " as your next guess.");
    console.log(allPosibilities.join(","));
    ++guessCount;

    const hintElement = document.getElementById("hint");
    let hintText = "";
    if (correctPosLetters.length === 5) {
      hintText = "Congratulations! We have found our answer!";
      document.getElementById("nextGuessBtn").style.visibility = "hidden";
      hintElement.innerText = hintText;
      return;
    }
    if (allPosibilities.length === 0) {
      hintText =
        "UhOh! There are no Wordle solutions for the inputs you provided.\nIt is likely that you marked one or more squares incorrectly.\nPlease refresh and try again!";
      document.getElementById("nextGuessBtn").style.visibility = "hidden";
      hintElement.innerText = hintText;
      return;
    }
    if (allPosibilities.length > 1) {
      if (correctPosLetters.length > 0) {
        hintText =
          hintText +
          "We have found " +
          correctPosLetters.length +
          " letters to be in correct place.\n";
      }
      // if (incorrectPosLetters.length > 0) {
      //   hintText =
      //     hintText +
      //     "The letters " +
      //     incorrectPosLetters.join(", ").toUpperCase() +
      //     " are present in the word, but we are not yet sure of their position.\n";
      // }
      if (correctPosLetters.length === 0 && incorrectPosLetters.length === 0) {
        hintText =
          hintText +
          "Unfortunately, we have not found any letters which are present in the word.\n";
      }
      if (allPosibilities.length > 5) {
        hintText +=
          "There are " +
          allPosibilities.length +
          " remaining wordle solutions.\n";
      } else {
        hintText +=
          "We have narrowed down our Wordle solutions to " +
          allPosibilities.length +
          " words.\n" +
          allPosibilities.join(", ").toUpperCase() +
          "\n";
      }
      hintText += "Lets try " + prevWord.toUpperCase() + " as our next guess.";

      hintElement.innerText = hintText;
    }

    for (let k = 0; k < 5; k++) {
      let btn = document.getElementById("button" + guessCount + (k + 1));
      const color =
        guessCount === 5 && allPosibilities.length > 0 ? 'red':
        allPosibilities.length === 1 || correctPosMap.get(k)
          ? "green"
          : "black";

      if (btn) {
        btn.style.background = color;
        btn.value = prevWord[k].toUpperCase();
      }
      const guessDiv = document.getElementById("guess" + guessCount);
      if (guessDiv) {
        guessDiv.style.visibility = "visible";
      }
    }
    if( guessCount === 5 && allPosibilities.length > 0){
      hintText = "ALERT!!! We have "+ allPosibilities.length + " possible solutions, but only one try left.\n"+
      "Please use caution and pick your next guess from: " + allPosibilities.join(", ").toUpperCase();
      hintElement.innerText = hintText;
    }
    if (allPosibilities.length === 1) {
      hintText = "Congratulations! We have found our answer!";
      document.getElementById("nextGuessBtn").style.visibility = "hidden";
      hintElement.innerText = hintText;
      return;
    }
  }

  return (
    <React.Fragment>
      <button
        onClick={() => navigate("/howto")}
        style={{
          width: "150px",
          height: "35px",
          margin: "10px",
          color: "white",
          background: "black",
          border: "1px solid white",
          fontWeight: "bold",
        }}
      >
        {" "}
        How to Use
      </button>
      <div className="App" style={{ margin: "50px" }}>
        <p id="hint" style={{ color: "white" }}>
          Let's start with CRANE.
        </p>
        {[1, 2, 3, 4, 5, 6].map((b) => {
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
            id="nextGuessBtn"
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
            onClick={getNextWord}
            value="Show Next Guess"
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
