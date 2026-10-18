const timeDisplay = document.getElementById("timeDisplay");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const lapButton = document.getElementById("lapButton");
const lapList = document.getElementById("lapList");
const lapCount = document.getElementById("lapCount");
const themeButton = document.getElementById("themeButton");

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapNumber = 0;

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor(
    (milliseconds % 3600000) / 60000
  );
  const seconds = Math.floor(
    (milliseconds % 60000) / 1000
  );
  const centiseconds = Math.floor(
    (milliseconds % 1000) / 10
  );

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0")
  ].join(":") + `.${centiseconds.toString().padStart(2, "0")}`;
}

function updateDisplay() {
  const currentTime = isRunning
    ? elapsedTime + (Date.now() - startTime)
    : elapsedTime;

  timeDisplay.textContent = formatTime(currentTime);
}

function startTimer() {
  if (isRunning) {
    return;
  }

  isRunning = true;
  startTime = Date.now();

  timerInterval = setInterval(updateDisplay, 10);

  startButton.disabled = true;
  pauseButton.disabled = false;
  lapButton.disabled = false;
}

function pauseTimer() {
  if (!isRunning) {
    return;
  }

  elapsedTime += Date.now() - startTime;
  isRunning = false;

  clearInterval(timerInterval);
  updateDisplay();

  startButton.disabled = false;
  pauseButton.disabled = true;
  lapButton.disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);

  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  lapNumber = 0;

  timeDisplay.textContent = "00:00:00.00";

  startButton.disabled = false;
  pauseButton.disabled = true;
  lapButton.disabled = true;

  lapList.innerHTML = `
    <p class="empty-message">
      Your lap times will appear here.
    </p>
  `;

  updateLapCount();
}

function addLap() {
  if (!isRunning) {
    return;
  }

  const currentTime =
    elapsedTime + (Date.now() - startTime);

  lapNumber += 1;

  const lapRow = document.createElement("div");
  lapRow.className = "lap-row";

  lapRow.innerHTML = `
    <span class="lap-number">Lap ${lapNumber}</span>
    <span class="lap-time">${formatTime(currentTime)}</span>
  `;

  if (lapNumber === 1) {
    lapList.innerHTML = "";
  }

  lapList.prepend(lapRow);
  updateLapCount();
}

function updateLapCount() {
  lapCount.textContent = `${lapNumber} ${
    lapNumber === 1 ? "lap" : "laps"
  }`;
}

function loadTheme() {
  const savedTheme = localStorage.getItem(
    "stopwatchTheme"
  );

  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeButton.textContent = "☀️";
  }
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
lapButton.addEventListener("click", addLap);

themeButton.addEventListener("click", () => {
  const isDark =
    document.body.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.body.removeAttribute("data-theme");
    themeButton.textContent = "🌙";
    localStorage.setItem("stopwatchTheme", "light");
  } else {
    document.body.setAttribute("data-theme", "dark");
    themeButton.textContent = "☀️";
    localStorage.setItem("stopwatchTheme", "dark");
  }
});

loadTheme();
updateDisplay();
updateLapCount();