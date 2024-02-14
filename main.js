const QUOTES_DATA_URL = `https://api.quotable.io/quotes/random?minLength=120&maxLength=150`;
const typedText = document.getElementById("typedText");
const start = document.getElementById("start");
const backdrop = document.getElementById("backdrop");
const innerBackdrop = document.getElementById("innerBackdrop");
const innerBackdropContent = document.getElementById("innerBackdropContent");
const bestScore = document.getElementById("bestScore");
let quote = document.querySelector("#quoteText");
let charArr;
let typedTextArr;
let accuracy;
let wpm;
let initialTime;
let highScore = false;

window.addEventListener("load", () => {
  if (localStorage.getItem("best-speed"))
    bestScore.innerHTML = `HighScore: ${localStorage.getItem("best-speed")}wpm`;
});

start.addEventListener("click", () => {
  setTimeout(addText, 0);
  initialTime = new Date();
});

const getQuote = async () => {
  const data = await fetch(QUOTES_DATA_URL);
  const json = await data.json();
  return json[0].content;
};

const addText = async () => {
  const data = await getQuote();
  charArr = data.split("");
  quote.innerHTML = "";
  charArr.forEach((char) => {
    let singleChar = document.createElement("span");
    singleChar.innerHTML = char;
    quote.append(singleChar);
  });
  typedText.value = "";
};

typedText.addEventListener("input", () => {
  typedTextArr = typedText.value.split("");
  let incorrect = 0;
  let count = 0;
  const quoteText = quote.querySelectorAll("span");
  quoteText.forEach((child, idx) => {
    if (typedTextArr[idx]) {
      count++;
      if (child.innerText === typedTextArr[idx]) {
        child.classList.add("text-green-600");
        child.classList.remove("text-red-600");
        child.classList.remove("underline");
      } else {
        incorrect++;
        child.classList.add("text-red-600");
        child.classList.add("underline");
        child.classList.remove("text-green-600");
      }
    } else {
      child.classList.remove("text-red-600");
      child.classList.remove("text-green-600");
      child.classList.remove("underline");
    }

    if (
      typedTextArr.length === quoteText.length &&
      count === quoteText.length - 1
    ) {
      getWPM(charArr, (new Date() - initialTime) / 60000);
      getAccuracy(charArr.length, incorrect);
      toggleBackdrop();
      addDetails();
    }
  });
});

function toggleDontCopy() {
  const dontCopyText = document.getElementById("dontCopyText");
  dontCopyText.classList.toggle("hidden");
}

const getWPM = (arr, timeTaken) => {
  const wordsArr = arr.join("").split(" ");
  wpm = Math.floor(wordsArr.length / timeTaken);
  if (!localStorage.getItem("best-speed")) {
    localStorage.setItem("best-speed", wpm);
  } else {
    let oldWpm = Number(localStorage.getItem("best-speed"));
    if (oldWpm < wpm) {
      highScore = true;
      localStorage.setItem("best-speed", wpm);
    }
  }
};

const getAccuracy = (length, incorrect) => {
  accuracy = ((100 * (length - incorrect)) / length).toFixed(2);
};

const toggleBackdrop = () => {
  backdrop.classList.toggle("hidden");
  quote.innerHTML = "Click on start to try again.";
  typedText.value = "";
  innerBackdropContent.innerHTML = "";
};

const addDetails = () => {
  const scoreInfo = document.createElement("p");
  bestScore.innerHTML = `HighScore: ${localStorage.getItem("best-speed")}wpm`;
  if (highScore) {
    scoreInfo.innerHTML = "Congrats!!🎉 You've achieved a new high score.";
  } else {
    scoreInfo.innerHTML = "Way far from your best😥, Keep Grinding.";
  }
  scoreInfo.setAttribute("class", "text-center text-2xl");

  const accuracyInfo = document.createElement("p");
  accuracyInfo.innerHTML = `Accuracy = ${accuracy}%`;
  accuracyInfo.setAttribute(
    "class",
    `${accuracy > 85 ? "text-green-700" : ""} ${
      accuracy > 60 && accuracy <= 85 ? "text-yellow-700" : ""
    } ${accuracy <= 60 ? "text-red-700" : ""} text-xl text-nowrap`
  );

  const wpmInfo = document.createElement("p");
  wpmInfo.innerHTML = `Speed = ${wpm}wpm`;
  wpmInfo.setAttribute(
    "class",
    `${wpm > 70 ? "text-green-700" : ""} ${
      wpm > 45 && wpm <= 70 ? "text-yellow-700" : ""
    } ${wpm <= 45 ? "text-red-700" : ""} text-xl text-nowrap`
  );

  const statsInfo = document.createElement("div");
  statsInfo.setAttribute("class", "flex flex-col gap-6 items-center");
  statsInfo.append(accuracyInfo, wpmInfo);
  innerBackdropContent.append(scoreInfo, statsInfo);
};

function clearProgress() {
  localStorage.clear();
  bestScore.innerHTML = "HighScore: 0";
}
