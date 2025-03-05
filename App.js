import "./App.css";
import { useState } from "react";
import { clsx } from "clsx";
import { languages } from "./languages";
import { getFarewellText, getRandomWord } from "./util";
import ReactConfetti from "react-confetti"; 

export function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  const numGuessessLeft = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessessLeft;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessedLetter =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  const languageElement = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    const className = clsx("chip", isLanguageLost && "lost");
    return (
      <span style={styles} className={className} key={lang.name}>
        {lang.name}
      </span>
    );
  });

  const letterElement = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    );
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessedLetter,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessedLetter) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well Done!🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>You Lose!</h2>
          <p>Better Luck Next Time😭</p>
        </>
      );
    }
    return null;
  }

  return (
    <main>
      {isGameWon && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false} 
          numberOfPieces={2000} 
        />
      )}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElement}</section>
      <section className="word">{letterElement}</section>
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry! The letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessessLeft - wrongGuessCount} attempts left.
        </p>
        <p>
          Current Word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "Blank."
            )
            .join(" ")}
        </p>
      </section>
      <section className="keybord">{keyboardElements}</section>
      {isGameOver && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  );
}

export default App;
