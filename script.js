const weapons = ["Shotgun", "AK-47", "Glock Pistol", "M249 Machine Gun"];

const questions = [
  { text: "Who is the founder of SpaceX?", options: ["Elon Musk", "Bill Gates"], correct: 0 },
  { text: "Who is the founder of Microsoft?", options: ["Bill Gates and Elon Musk", "Bill Gates and Paul Allen"], correct: 1 },
  { text: "Who is the CEO of OpenAI?", options: ["Elon Musk", "Sam Altman"], correct: 1 },
  { text: "Who is the founder of Meta (Facebook)?", options: ["Mark Zuckerberg", "Bill Gates"], correct: 0 }
];

const story = document.getElementById("story");
const choices = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const healthEl = document.getElementById("health");
const weaponEl = document.getElementById("weapon");
const inventoryEl = document.getElementById("inventory");
const locationEl = document.getElementById("location");
const counterEl = document.getElementById("question-counter");
const commandStatus = document.getElementById("command-status");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");

let score = 0;
let health = 100;
let weapon = "";
let questionIndex = 0;
let previousScreen = null;
let gameState = "intro";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function updateHud() {
  scoreEl.textContent = String(score).padStart(3, "0");
  healthEl.textContent = `${health}%`;
  weaponEl.textContent = weapon || "—";
  inventoryEl.textContent = weapon ? `1× ${weapon}` : "NOTHING";
}

function setLocation(name) {
  locationEl.textContent = name;
}

function setCommand(text) {
  commandStatus.textContent = text;
}

function setScreen(nextState) {
  previousScreen = gameState;
  gameState = nextState;
}

function setStory(html) {
  story.innerHTML = html;
}

function setChoices(items) {
  choices.innerHTML = items.map((item, index) => {
    const cls = item.className ? `choice ${item.className}` : "choice";
    return `<button class="${cls}" type="button" data-choice="${index}"><span>${item.label}</span></button>`;
  }).join("");

  choices.querySelectorAll("button").forEach((button, index) => {
    button.addEventListener("click", () => items[index].action());
  });
}

async function boot() {
  score = 0;
  health = 100;
  questionIndex = 0;
  weapon = weapons[Math.floor(Math.random() * weapons.length)];
  setLocation("OUTSKIRTS");
  counterEl.textContent = "SYSTEM BOOT";
  updateHud();
  setCommand("INITIALIZING SURVIVAL PROTOCOL");
  choices.innerHTML = "";
  setStory(`<span class="muted">BOOT SEQUENCE</span>\n\nLoading survival database...\nLoading environment...\nScanning for movement...\n\n<span class="danger">WARNING: ZOMBIE ACTIVITY DETECTED</span>`);
  await sleep(700);
  showStart();
}

function showStart() {
  setScreen("start");
  setLocation("OUTSKIRTS");
  counterEl.textContent = "SYSTEM READY";
  setCommand("CHOOSE YOUR NEXT MOVE");
  setStory(`You are standing at the edge of a deserted area.\nA ruined house sits ahead. Somewhere nearby, a dark cave disappears into the ground.\n\n<span class="accent">Your randomly assigned weapon:</span> ${escapeHtml(weapon)}\n<span class="danger">Ammo: 0</span>\n\nThe outbreak has already reached this place. You hear something moving inside the house.`);
  setChoices([
    { label: "Enter the abandoned house", action: enterHouse },
    { label: "Enter the dark cave", action: goToCave },
    { label: "Check your inventory", action: showInventory }
  ]);
}

function showInventory() {
  setScreen("inventory");
  setCommand("INVENTORY CHECK");
  setStory(`<span class="accent">INVENTORY</span>\n\nWeapon: ${escapeHtml(weapon)}\nAmmo: 0\nHealth: ${health}%\nScore: ${score}\n\nYou have nothing else. If you want to survive, you need ammunition.`);
  setChoices([
    { label: "Return to the outskirts", action: showStart },
    { label: "Enter the dark cave", action: goToCave }
  ]);
}

function enterHouse() {
  setScreen("death-house");
  health = 0;
  score = 0;
  updateHud();
  setLocation("ABANDONED HOUSE");
  counterEl.textContent = "CRITICAL FAILURE";
  setCommand("LIFE SIGNS: NONE");
  setStory(`<span class="danger">MOVEMENT DETECTED.</span>\n\nYou step through the doorway.\nA zombie was waiting in the darkness. Your weapon has no ammunition.\n\n<span class="danger">The zombie attacks.</span>\n\nGAME OVER.`);
  setChoices([
    { label: "Restart the mission", action: restartGame, className: "danger" }
  ]);
}

function goToCave() {
  setScreen("cave");
  setLocation("DARK CAVE");
  counterEl.textContent = "UNKNOWN AREA";
  setCommand("PATH FOUND");
  setStory(`The cave is cold and almost completely dark.\nYou find a small supply crate. Inside is ammunition.\n\nA distant growl echoes through the tunnel.\n\n<span class="accent">Ammunition acquired.</span>\n\nThe abandoned house is now your only route forward.`);
  setChoices([
    { label: "Enter the abandoned house", action: startQuiz },
    { label: "Check your inventory", action: showInventory }
  ]);
  inventoryEl.textContent = `1× ${weapon}\nAMMO ACQUIRED`;
}

function startQuiz() {
  setScreen("quiz");
  score = 0;
  health = 100;
  questionIndex = 0;
  updateHud();
  showQuestion();
}

function showQuestion() {
  const q = questions[questionIndex];
  setLocation("ABANDONED HOUSE");
  counterEl.textContent = `QUESTION ${questionIndex + 1} / ${questions.length}`;
  setCommand("ANSWER TO FIRE");
  const progress = ((questionIndex) / questions.length) * 100;
  setStory(`<div class="progress"><span style="width:${progress}%"></span></div><span class="accent">ZOMBIE ENCOUNTER</span>\n\n${escapeHtml(q.text)}\n\n<span class="muted">Choose the correct answer to keep your weapon loaded.</span>`);
  setChoices(q.options.map((option, index) => ({
    label: `${index + 1}. ${option}`,
    action: () => answerQuestion(index)
  })));
}

async function answerQuestion(selected) {
  const q = questions[questionIndex];
  const correct = selected === q.correct;
  const buttons = [...choices.querySelectorAll("button")];
  buttons.forEach(button => button.disabled = true);

  if (correct) {
    score += 50;
  }

  updateHud();
  counterEl.textContent = correct ? "TARGET HIT" : "TARGET MISSED";
  setCommand(correct ? "ZOMBIE DAMAGED" : "WARNING: WRONG ANSWER");

  setStory(correct
    ? `<span class="accent">✓ CORRECT</span>\n\n${escapeHtml(q.text)}\n\nYour answer was correct.\nThe shot hits the zombie.\n\n<span class="accent">+50 SCORE</span>\nCurrent score: ${score}`
    : `<span class="danger">✕ WRONG</span>\n\n${escapeHtml(q.text)}\n\nYour answer was wrong.\nThe zombie gets closer.\n\n<span class="danger">NO SCORE</span>\nCurrent score: ${score}`
  );

  choices.innerHTML = `<div class="choice ${correct ? "" : "danger"}">${correct ? "[ ZOMBIE HIT ]" : "[ ZOMBIE SURVIVES ]"}</div>`;
  await sleep(1000);

  questionIndex += 1;
  if (questionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  setScreen("result");
  const won = score >= 100 && health === 100;
  counterEl.textContent = won ? "MISSION COMPLETE" : "MISSION FAILED";
  setCommand(won ? "SURVIVOR STATUS: ALIVE" : "SURVIVOR STATUS: UNKNOWN");
  setLocation("ABANDONED HOUSE");
  setStory(`<div class="result-title ${won ? "" : "danger"}">${won ? "YOU SURVIVED" : "GAME OVER"}</div>\n${won ? "The zombie threat has been neutralized." : "Not enough correct answers. The zombies remain."}\n\n<div class="score-final">FINAL SCORE: ${score} / 200</div>\nHealth: ${health}%\nWeapon: ${escapeHtml(weapon)}`);
  setChoices([
    { label: "Start a new survival run", action: restartGame },
    { label: "Return to the outskirts", action: showStart }
  ]);
}

function restartGame() {
  boot();
}

backBtn.addEventListener("click", () => {
  if (gameState === "quiz") {
    showInventory();
  } else if (gameState !== "start") {
    showStart();
  }
});

restartBtn.addEventListener("click", restartGame);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

boot();
