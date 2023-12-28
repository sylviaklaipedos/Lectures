const FIELD_SIZE = 10;
let direction = "right";
let hasStep = true;
let score = 0;
const field = document.createElement("div");

const input = document.createElement("input");
input.disabled = true;
input.value = `points: ${score}`;
document.body.appendChild(input);

field.classList.add("field");
document.body.appendChild(field);

const directionDictionary = {
  ArrowUp: {
    value: "top",
    type: "vertical",
    update: (x, y) => [x, y === 1 ? FIELD_SIZE : y - 1],
  },
  ArrowRight: {
    value: "right",
    type: "horizontal",
    update: (x, y) => [x === FIELD_SIZE ? 1 : x + 1, y],
  },
  ArrowDown: {
    value: "down",
    type: "vertical",
    update: (x, y) => [x, y === FIELD_SIZE ? 1 : y + 1],
  },
  ArrowLeft: {
    value: "left",
    type: "horizontal",
    update: (x, y) => [x === 1 ? FIELD_SIZE : x - 1, y],
  },
};

function getElementByCoordinates(x, y) {
  return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
}

function getRandomCoordinates(mouse = false) {
  const c = mouse ? 1 : 3;
  const x = Math.round(Math.random() * (FIELD_SIZE - c) + c);
  const y = Math.round(Math.random() * (FIELD_SIZE - 1) + 1);
  return [x, y];
}

for (let i = 0; i < FIELD_SIZE * FIELD_SIZE; i++) {
  const excel = document.createElement("div");
  excel.classList.add("excel");
  excel.dataset.x = (i % FIELD_SIZE) + 1;
  excel.dataset.y = Math.floor(i / FIELD_SIZE) + 1;
  field.appendChild(excel);
}

function generateSnake() {
  const [x, y] = getRandomCoordinates();
  return [
    [x, y],
    [x - 1, y],
    [x - 2, y],
  ];
}

const snake = [];
const coordinates = generateSnake();
coordinates.forEach((el, index) => {
  const element = getElementByCoordinates(...el);
  element.classList.add(index ? "snake-body" : "snake-head");
  snake.push(element);
});

let mouse;

function createMouse() {
  const generateMouse = () => {
    const [x, y] = getRandomCoordinates(true);
    mouse = getElementByCoordinates(x, y);
  };

  while (!mouse || mouse.className.includes("snake")) {
    generateMouse();
  }

  mouse.classList.add("mouse");
}

createMouse();

function move() {
  const [x, y] = [+snake[0].dataset.x, +snake[0].dataset.y];
  snake[0].classList.remove("snake-head");
  snake[0].classList.add("snake-body");
  snake.at(-1).classList.remove("snake-body");
  snake.pop();

  const obj = Object.values(directionDictionary).find(
    (el) => el.value === direction
  );
  const [newX, newY] = obj.update(x, y);
  const newHead = getElementByCoordinates(newX, newY);
  newHead.classList.add("snake-head");
  snake.unshift(newHead);

  if (newHead.classList.contains("snake-body")) {
    clearInterval(t);
    setTimeout(() => {
      alert("end");
    }, 200);
  }

  if (newHead.classList.contains("mouse")) {
    const [lastX, lastY] = [+snake.at(-1).dataset.x, +snake.at(-1).dataset.y];
    newHead.classList.remove("mouse");
    snake.push(getElementByCoordinates(lastX, lastY));
    input.value = `points: ${++score}`;
    createMouse();
  }

  snake.at(-1).classList.add("snake-body");
  hasStep = true;
}

const t = setInterval(move, 300);

document.addEventListener("keydown", (e) => {
  const newDirection = directionDictionary[e.key];
  if (!newDirection) return;

  const currentType = Object.values(directionDictionary).find(
    (el) => el.value === direction
  ).type;
  if (currentType !== newDirection.type && hasStep) {
    direction = newDirection.value;
    hasStep = false;
  }

  direction = newDirection.value;
});
