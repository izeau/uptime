"use strict";

const clock = document.querySelector(".clock");
const path = document.querySelector("#path");
const hours = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const hourMarks = clock.querySelector("text");
const secondMarks = clock.querySelector(".second-marks");
const minuteMarks = clock.querySelector(".minute-marks");
const params = new URLSearchParams(location.search);
let numbered = params.has("numbered");
let bounce = params.get("bounce") !== "no";

for (const [index, label] of hours.entries()) {
  hourMarks.appendChild(
    createNode("textPath", {
      href: "#path",
      startOffset: `${(index / 12) * 100}%`,
      innerHTML: label,
    })
  );
}

for (let index = 0; index < 60; index += 1) {
  if (!numbered || index % 5) {
    minuteMarks.appendChild(
      createNode("path", {
        class: "mark",
        transform: `rotate(${index * 6} 50 50)`,
        d: `M 50 3 V ${index % 5 ? 4 : 6}`,
      })
    );

    secondMarks.appendChild(
      createNode("path", {
        class: "mark",
        transform: `rotate(${index * 6} 50 50)`,
        d: `M 50 2 V ${index % 5 ? 1 : 0}`,
      })
    );
  } else {
    minuteMarks.appendChild(
      createNode("text", {
        class: "numbered-mark",
        transform: `rotate(${index * 6} 50 50)`,
        innerHTML: index,
        x: 50,
        y: 5,
      })
    );

    secondMarks.appendChild(
      createNode("text", {
        class: "numbered-mark",
        transform: `rotate(${index * 6} 50 50)`,
        innerHTML: index,
        x: 50,
        y: 2,
      })
    );
  }
}

setInterval(update, 30);

function createNode(type, attrs) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", type);

  for (const [name, value] of Object.entries(attrs)) {
    if (name === "innerHTML") {
      node.innerHTML = value;
    } else {
      node.setAttribute(name, value);
    }
  }

  return node;
}

function update() {
  const now = new Date();
  const fractionalSeconds = now.getMilliseconds() / 1000;
  const seconds = now.getSeconds() + (bounce ? easeOutElastic(fractionalSeconds) : easeOutExpo(fractionalSeconds));
  const minutes = now.getMinutes() + seconds / 60;
  const hours = now.getHours() + minutes / 60;

  hourMarks.setAttribute("transform", `rotate(${-30 * hours} 50 50)`);
  minuteMarks.setAttribute("transform", `rotate(${-6 * minutes} 50 50)`);
  secondMarks.setAttribute("transform", `rotate(${-6 * seconds} 50 50)`);
}

function easeOutElastic(x) {
  return x && Math.pow(2, -10 * x) * Math.sin(((x * 10 - 0.75) * (2 * Math.PI)) / 3) + 1;
}

function easeOutExpo(x) {
  return 1 - Math.pow(2, -10 * x);
}

function livelyPropertyListener(name, value) {
  switch (name) {
    case "backgroundColor":
      document.documentElement.style.setProperty("--background-color", value);
      break;

    case "clockColor":
      document.documentElement.style.setProperty("--clock-color", value);
      break;

    case "showNumbers":
      numbered = value;
      break;

    case "enableBounce":
      bounce = value;
      break;

    case "clockSize":
      document.documentElement.style.setProperty("--clock-size", `${value}px`);
      break;
  }
}
